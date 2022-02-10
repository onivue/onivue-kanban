import create from 'zustand'
import { db } from '@/lib/firebase'
import { collection, query, onSnapshot, doc, addDoc, deleteDoc, setDoc, getDocs, getDoc } from 'firebase/firestore'

const useKanbanStore = create((set, get) => ({
    loading: true,
    errorMessage: null,
    setLoading: (payload) => set({ loading: payload }),
    collectionRef: collection(db, 'kanban'),
    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    boards: [],
    boardName: [],
    tasks: [],
    columns: [],
    columnOrder: [],
    kanbanData: { columnOrder: [], columns: {}, tasks: {} },
    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    setBoard: async (payload, id = null, userId, addColumnOrder = false) => {
        let docSnap
        if (id) {
            const ref = doc(collection(db, `users/${userId}/boards`), id)
            docSnap = await setDoc(ref, payload)
        } else {
            const ref = collection(db, `users/${userId}/boards`)
            docSnap = await addDoc(ref, payload)
        }
        if (addColumnOrder) {
            const columnOrder = { id: 'columnOrder', order: [] }
            get().setColumn(columnOrder, userId, docSnap.id, 'columnOrder')
        }
    },
    //?---------------------------------
    getBoards: async (userId) => {
        onSnapshot(collection(db, `users/${userId}/boards`), (snapshot) => {
            // console.log(snapshot.docs.length)
            const documents = []
            snapshot.forEach((doc) => documents.push({ id: doc.id, ...doc.data() }))
            set({ boards: documents })
        })
    },
    //?---------------------------------
    deleteBoard: async (id, userId) => {
        const ref = doc(db, `users/${userId}/boards`, id)
        await deleteDoc(ref)
    },

    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    setColumn: async (payload, userId, boardId, columnId) => {
        try {
            const ref = doc(collection(db, `users/${userId}/boards/${boardId}/columns`), columnId)
            await setDoc(ref, payload, { merge: true })
        } catch (err) {
            console.log(err)
        }
    },
    deleteColumn: (payload) => {},
    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    getKanbanTasks: async (userId, boardId) => {
        onSnapshot(collection(db, `users/${userId}/boards/${boardId}/tasks`), (snapshot) => {
            const documents = []
            snapshot.forEach((doc) => documents.push({ id: doc.id, ...doc.data() }))
            set({ tasks: documents })
        })
    },
    getKanbanBoardName: async (userId, boardId) => {
        const docRef = doc(db, `users/${userId}/boards`, boardId)
        const docSnap = await getDoc(docRef)
        set({ boardName: docSnap.data().name })
    },
    getKanbanColumns: async (userId, boardId) => {
        onSnapshot(collection(db, `users/${userId}/boards/${boardId}/columns`), (snapshot) => {
            const documents = []
            snapshot.forEach((doc) => documents.push({ id: doc.id, ...doc.data() }))
            set({ columns: documents })
        })
    },
    setKanbanData: (payload) => {
        set({ kanbanData: payload })
    },
    setBoardName: async (payload, userId, boardId) => {
        try {
            const ref = doc(collection(db, `users/${userId}/boards`), boardId)
            await setDoc(ref, payload)
            set({ boardName: payload.name })
        } catch (err) {
            console.log(err)
        }
    },
    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}))

export default useKanbanStore
