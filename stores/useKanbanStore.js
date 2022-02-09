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
    kanbanData: [],
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
            get().setColumnOrder(columnOrder, userId, docSnap.id)
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
    setColumnOrder: async (payload, userId, boardId) => {
        const ref = doc(collection(db, `users/${userId}/boards/${boardId}/columns`), 'columnOrder')
        await setDoc(ref, payload)
    },
    deleteCol: (payload) => {},
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
    //!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    addTodo: (payload) => {
        addDoc(get().collectionRef, { title: payload })
    },
    setTodo: async (payload, id = null) => {
        if (id) {
            console.log('ID')
            const ref = doc(get().collectionRef, id)
            await setDoc(ref, payload)
            console.log(doc)
        } else {
            const ref = get().collectionRef
            const doc = await addDoc(ref, payload)
            console.log(doc)
        }
    },

    removeTodo: (payload) => {
        deleteDoc(doc(get().collectionRef, payload))
    },
}))

export default useKanbanStore
