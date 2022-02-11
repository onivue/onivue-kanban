import create from 'zustand'
import { db } from '@/lib/firebase'
import {
    collection,
    query,
    onSnapshot,
    doc,
    addDoc,
    deleteDoc,
    setDoc,
    getDocs,
    getDoc,
    arrayUnion,
    arrayRemove,
} from 'firebase/firestore'

const useKanbanStore = create((set, get) => ({
    loading: true,
    errorMessage: null,
    setLoading: (payload) => set({ loading: payload }),
    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    boards: [],
    kanbanData: { columnOrder: [], columns: {}, tasks: {}, bardName: '' },
    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    setBoard: async (payload, id = null, userId, addColumnOrder = false) => {
        let docSnap
        if (addColumnOrder) {
            payload = { ...payload, columnOrder: [] }
        }
        if (id) {
            const ref = doc(collection(db, `users/${userId}/boards`), id)
            docSnap = await setDoc(ref, payload, { merge: true })
        } else {
            const ref = collection(db, `users/${userId}/boards`)
            docSnap = await addDoc(ref, payload)
        }
    },
    //?---------------------------------
    getBoards: (userId) => {
        const unsubscribe = onSnapshot(collection(db, `users/${userId}/boards`), (snapshot) => {
            // console.log(snapshot.docs.length)
            const documents = []
            snapshot.forEach((doc) => documents.push({ id: doc.id, ...doc.data() }))
            set({ boards: documents })
        })
        return unsubscribe
    },
    //?---------------------------------
    deleteBoard: async (id, userId) => {
        const ref = doc(db, `users/${userId}/boards`, id)
        await deleteDoc(ref)
    },

    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    setColumn: async (payload, userId, boardId, columnId, columnOrder = { type: 'add' }) => {
        const ref = doc(collection(db, `users/${userId}/boards/${boardId}/columns`), columnId)
        if (columnId === '__columnOrder' && !Array.isArray(payload.order)) {
            if (columnOrder.type === 'add') {
                payload = { ...payload, order: arrayUnion(payload.order) }
            }
            if (columnOrder.type === 'delete') {
                payload = { ...payload, order: arrayRemove(payload.order) }
                console.log('DELETE', payload)
            }
        }
        await setDoc(ref, payload, { merge: true })
    },
    deleteColumn: async (userId, boardId, columnId, tasks) => {
        try {
            // UPDATE ORDER
            get().setColumn({ order: columnId }, userId, boardId, '__columnOrder', { type: 'delete' })
            // DELETE DOC
            const ref = doc(db, `users/${userId}/boards/${boardId}/columns`, columnId)
            await deleteDoc(ref)
            // DELETE TASKS
            tasks.forEach(async (task) => {
                const ref = doc(db, `users/${userId}/boards/${boardId}/tasks`, task)
                await deleteDoc(ref)
            })
        } catch (err) {
            console.log(err)
        }
    },
    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    getKanbanData: (userId, boardId) => {
        // KANBAN DETAILS
        const unsubscribe1 = onSnapshot(doc(db, `users/${userId}/boards`, boardId), (snapshot) => {
            set({
                kanbanData: {
                    ...get().kanbanData,
                    columnOrder: snapshot.data().columnOrder,
                    boardName: snapshot.data().name,
                },
            })
        })
        // COLUMNS
        const unsubscribe2 = onSnapshot(collection(db, `users/${userId}/boards/${boardId}/columns`), (snapshot) => {
            const documents = {}
            snapshot.forEach((doc) => (documents[doc.id] = { id: doc.id, ...doc.data() }))
            // set({ columns: documents })
            set({ kanbanData: { ...get().kanbanData, columns: documents } })
        })
        // TASKS
        const unsubscribe3 = onSnapshot(collection(db, `users/${userId}/boards/${boardId}/tasks`), (snapshot) => {
            const documents = {}
            snapshot.forEach((doc) => (documents[doc.id] = { id: doc.id, ...doc.data() }))
            // set({ tasks: documents })
            set({ kanbanData: { ...get().kanbanData, tasks: documents } })
        })
        return () => {
            unsubscribe1()
            unsubscribe2()
            unsubscribe3()
        }
    },

    setBoardName: async (payload, userId, boardId) => {
        try {
            const ref = doc(collection(db, `users/${userId}/boards`), boardId)
            await setDoc(ref, payload, { merge: true })
        } catch (err) {
            console.log(err)
        }
    },
    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}))

export default useKanbanStore
