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
    serverTimestamp,
} from 'firebase/firestore'

const useKanbanStore = create((set, get) => ({
    loading: true,
    errorMessage: null,
    setLoading: (payload) => set({ loading: payload }),
    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    boards: [],
    kanbanData: { columnOrder: [], columns: {}, tasks: {}, bardName: '' },
    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    setBoard: async (payload, userId, boardId = null, columnOrder = { type: 'add' }) => {
        let ref
        if (boardId) {
            ref = doc(collection(db, `users/${userId}/boards`), boardId)
        } else {
            ref = doc(collection(db, `users/${userId}/boards`))
        }
        if (payload.columnOrder && !Array.isArray(payload.columnOrder)) {
            if (columnOrder.type === 'add') {
                payload = { ...payload, columnOrder: arrayUnion(payload.columnOrder) }
            }
            if (columnOrder.type === 'delete') {
                payload = { ...payload, columnOrder: arrayRemove(payload.columnOrder) }
            }
        }
        await setDoc(ref, payload, { merge: true })
    },
    //?---------------------------------
    deleteBoard: async (boardId, userId) => {
        const ref = doc(db, `users/${userId}/boards`, boardId)
        await deleteDoc(ref)
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
    getKanbanData: (userId, boardId) => {
        // KANBAN DETAILS
        const unsubscribe1 = onSnapshot(doc(db, `users/${userId}/boards`, boardId), (snapshot) => {
            if (snapshot.data())
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

    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    setColumn: async (payload, userId, boardId, columnId) => {
        const ref = doc(collection(db, `users/${userId}/boards/${boardId}/columns`), columnId)
        await setDoc(ref, payload, { merge: true })
    },
    deleteColumn: async (userId, boardId, columnId, tasks) => {
        try {
            // UPDATE ORDER
            get().setBoard({ columnOrder: columnId }, userId, boardId, { type: 'delete' })
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
    setTask: async (payload, userId, boardId, taskId, columnId, type = 'update') => {
        if (type === 'add') {
            const ref = collection(db, `users/${userId}/boards/${boardId}/tasks`)
            payload.dateAdded = serverTimestamp()

            const createdDoc = await addDoc(ref, payload)

            get().setColumn({ taskIds: arrayUnion(createdDoc.id) }, userId, boardId, columnId)
        } else {
            const ref = doc(collection(db, `users/${userId}/boards/${boardId}/tasks`), taskId)
            await setDoc(ref, payload, { merge: true })
        }
    },
    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}))

export default useKanbanStore
