import { useCallback, useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import {
    onSnapshot,
    addDoc,
    collection,
    deleteDoc,
    deleteField,
    doc,
    // getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where,
    orderBy,
    limit,
    limitToLast,
    startAt,
    startAfter,
    endAt,
    endBefore,
    serverTimestamp,
    toMillis,
} from '@firebase/firestore'
// TODO: CONTEXT
// import { useFirebase } from '../context/useFirebase'

/**
 * Fetch a collection of documents from firestore
 * @param {string} collectionName the collection path
 * @param {object} queryObject [OPTIONAL]
 * @param {object} swrOptions [OPTIONAL]
 * @returns {data} the data fetched
 * @returns {err} the err object, if any
 * @returns {isBusy} the state
 * @returns {actions} the 'add()' and 'remove()' actions
 * @example
 *  const [data, err, isBusy] = useCollection("/users");
 *  const [data, err, isBusy] = useCollection("/users", {listen: true});
 *  const [data, isLoading, {add, remove}] = useCollection("/users", {listen: true, filter: ["Num", ">=", 2]});
 */
const useCollection = (collectionName, queryObject = {}, options = {}) => {
    const [data, setData] = useState(undefined)
    const [err, setErr] = useState(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const {
        where: _where,
        orderBy: _orderBy,
        limit: _limit,
        limitToLast: _limitToLast,
        endAt: _endAt,
        endBefore: _endBefore,
        startAfter: _startAfter,
        startAt: _startAt,
        listen = false,
        // parseDates,
    } = queryObject

    const createQuery = () => {
        const queries = []
        let queryRef = collection(db, collectionName)
        if (_where) {
            const multipleConditions = (w) => {
                return !!w && Array.isArray(w[0])
            }
            ;(multipleConditions(_where) ? _where : [_where]).forEach((w) =>
                queries.push(where(w[0], w[1], w[2])),
            )
        }
        if (_orderBy) {
            if (typeof _orderBy === 'string') {
                queries.push(_orderBy(_orderBy))
            } else if (Array.isArray(_orderBy)) {
                const multipleOrderBy = (o) => {
                    return Array.isArray(o[0])
                }
                ;(multipleOrderBy(_orderBy) ? _orderBy : [_orderBy]).forEach(([order, direction]) =>
                    queries.push(orderBy(order, direction)),
                )
            }
        }
        if (_limit) {
            queries.push(limit(_limit))
        } else if (_limitToLast) {
            queries.push(limitToLast(_limitToLast))
        }
        if (_startAt) {
            queries.push(startAt(_startAt))
        }
        if (_endAt) {
            queries.push(endAt(_endAt))
        }
        if (_startAfter) {
            queries.push(startAfter(_startAfter))
        }
        if (_endBefore) {
            queries.push(endBefore(_endBefore))
        }
        return queries.length > 0 ? query(queryRef, ...queries) : queryRef
    }

    const fetchSnapshot = (query, signal) => {
        return onSnapshot(
            query,
            (res) => {
                if (!signal.aborted) {
                    setData(
                        res.docs.map((doc) => {
                            return {
                                ...doc.data(),
                                id: doc.id,
                                exists: doc.exists,
                                // Date fields to Millis
                                ...(doc.data()?.createdAt && {
                                    createdAt: doc.data()?.createdAt.toMillis() || 0,
                                }),
                                ...(doc.data()?.updatedAt && {
                                    updatedAt: doc.data()?.updatedAt.toMillis() || 0,
                                }),
                            }
                        }),
                    )
                    setErr(null)
                    setIsLoading(false)
                }
            },
            (err) => {
                if (!signal.aborted) {
                    setData(undefined)
                    setErr(err)
                }
            },
        )
    }

    const fetchDocs = async (query, signal) => {
        try {
            const snapshot = await getDocs(query)

            if (!signal.aborted) {
                setData(
                    snapshot.docs.map((doc) => {
                        return {
                            ...doc.data(),
                            id: doc.id,
                        }
                    }),
                )
                setErr(null)
            }
        } catch (err) {
            if (!signal.aborted) {
                setData(undefined)
                setErr(err)
            }
        } finally {
            if (!signal.aborted) {
                setIsLoading(false)
            }
        }
    }

    useEffect(() => {
        console.log('useCollection', collectionName)
        const abortController = new AbortController()
        const signal = abortController.signal
        let unsubscribe = undefined
        const fetchData = async () => {
            setIsLoading(true)

            const queryRef = createQuery()

            if (listen || false) {
                unsubscribe = fetchSnapshot(queryRef, signal)
            } else {
                await fetchDocs(queryRef, signal)
            }
        }
        fetchData()
        return () => {
            abortController.abort()
            if (unsubscribe !== undefined) {
                unsubscribe()
            }
        }
    }, [])

    const add = async (data, id = null) => {
        if (id) {
            const ref = doc(db, collectionName, id)
            await setDoc(ref, data)
            return id
        } else {
            const ref = collection(db, collectionName)
            const doc = await addDoc(ref, data)
            if (!listen) {
                await reload()
            }
            return doc.id
        }
    }

    const remove = async (id) => {
        const ref = doc(db, collectionName, id)
        await deleteDoc(ref)
        if (!listen) {
            await reload()
        }
    }

    const reload = async () => {
        if (listen) {
            console.warn('error: in listen mode you can not refresh!')
        } else {
            const abortController = new AbortController()
            const signal = abortController.signal
            const queryRef = createQuery()
            await fetchDocs(queryRef, signal)
            abortController.abort()
        }
    }
    return [data, isLoading, err, { add, remove, reload }]
}

export { useCollection }
