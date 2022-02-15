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
    setBoard: async (
        payload = {
            type: '',
            data: {},
            userId: '',
            boardId: '',
        },
    ) => {
        const col = collection(db, `users/${payload.userId}/boards`)
        if (payload.type === 'create') {
            await addDoc(col, payload.data)
        }
        if (payload.type === 'update') {
            if (payload.data.columnOrder && typeof payload.data.columnOrder === 'string') {
                payload.data = { ...payload.data, columnOrder: arrayUnion(payload.data.columnOrder) }
            }
            await setDoc(doc(col, payload.boardId), payload.data, { merge: true })
        }
        if (payload.type === 'delete') {
            // DELETE ALL COLUMNS FROM BOARD
            const columns = await getDocs(
                collection(db, `users/${payload.userId}/boards/${payload.boardId}/columns`),
            )
            columns.forEach(async (doc) => {
                await deleteDoc(doc.ref)
            })
            // DELETE ALL TASKS FROM BOARD
            const tasks = await getDocs(
                collection(db, `users/${payload.userId}/boards/${payload.boardId}/tasks`),
            )
            tasks.forEach(async (doc) => {
                await deleteDoc(doc.ref)
            })
            // DELETE BOARD
            await deleteDoc(doc(col, payload.boardId))
        }
    },
    //?---------------------------------
    getBoards: (
        payload = {
            userId: '',
        },
    ) => {
        const unsubscribe = onSnapshot(collection(db, `users/${payload.userId}/boards`), (snapshot) => {
            const documents = []
            snapshot.forEach((doc) => documents.push({ id: doc.id, ...doc.data() }))
            set({ boards: documents })
        })
        return unsubscribe
    },
    //?---------------------------------
    getKanbanData: (payload = { userId: '', boardId: '' }) => {
        // KANBAN DETAILS
        const unsubscribe1 = onSnapshot(
            doc(db, `users/${payload.userId}/boards`, payload.boardId),
            (snapshot) => {
                if (snapshot.data())
                    set({
                        kanbanData: {
                            ...get().kanbanData,
                            columnOrder: snapshot.data().columnOrder,
                            boardName: snapshot.data().title,
                        },
                    })
            },
        )
        // COLUMNS
        const unsubscribe2 = onSnapshot(
            collection(db, `users/${payload.userId}/boards/${payload.boardId}/columns`),
            (snapshot) => {
                const documents = {}
                snapshot.forEach((doc) => (documents[doc.id] = { id: doc.id, ...doc.data() }))
                // set({ columns: documents })
                set({ kanbanData: { ...get().kanbanData, columns: documents } })
            },
        )
        // TASKS
        const unsubscribe3 = onSnapshot(
            collection(db, `users/${payload.userId}/boards/${payload.boardId}/tasks`),
            (snapshot) => {
                const documents = {}
                snapshot.forEach((doc) => (documents[doc.id] = { id: doc.id, ...doc.data() }))
                // set({ tasks: documents })
                set({ kanbanData: { ...get().kanbanData, tasks: documents } })
            },
        )
        return () => {
            unsubscribe1()
            unsubscribe2()
            unsubscribe3()
        }
    },

    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    setColumn: async (payload = { type: '', data: {}, userId: '', boardId: '', columnId: '', tasks: [] }) => {
        const col = collection(db, `users/${payload.userId}/boards/${payload.boardId}/columns`)
        if (payload.type === 'create') {
            await addDoc(col, payload.data)
        }
        if (payload.type === 'update') {
            await setDoc(doc(col, payload.columnId), payload.data, { merge: true })
        }
        if (payload.type === 'delete') {
            // UPDATE ORDER
            get().setBoard({
                type: 'update',
                data: { columnOrder: arrayRemove(payload.columnId) },
                userId: payload.userId,
                boardId: payload.boardId,
                taskId: null,
                columnId: null,
                tasks: [],
            })
            // DELETE COLUMN
            await deleteDoc(doc(col, payload.columnId))
            // DELETE TASKS
            payload.tasks.forEach(async (task) => {
                const ref = doc(db, `users/${payload.userId}/boards/${payload.boardId}/tasks`, task)
                await deleteDoc(ref)
            })
        }
    },
    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    setTask: async (
        payload = {
            type: '',
            data: {},
            userId: '',
            boardId: '',
            taskId: '',
            columnId: '',
        },
    ) => {
        const col = collection(db, `users/${payload.userId}/boards/${payload.boardId}/tasks`)
        if (payload.type === 'create') {
            payload.data.dateAdded = serverTimestamp()
            const createdDoc = await addDoc(col, payload.data)
            get().setColumn({
                type: 'update',
                data: { taskIds: arrayUnion(createdDoc.id) },
                userId: payload.userId,
                boardId: payload.boardId,
                columnId: payload.columnId,
            })
        }
        if (payload.type === 'update') {
            await setDoc(doc(col, payload.taskId), payload.data, { merge: true })
        }
        if (payload.type === 'delete') {
            await deleteDoc(doc(col, payload.taskId))
        }
    },
    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}))

export default useKanbanStore

const payload = {
    type: '',
    data: {},
    userId: '',
    boardId: '',
    taskId: '',
    columnId: '',
    tasks: [],
}
