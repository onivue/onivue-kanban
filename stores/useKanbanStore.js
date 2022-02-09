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
} from 'firebase/firestore'

const useKanbanStore = create((set, get) => ({
    loading: true,
    errorMessage: null,
    setLoading: (payload) => set({ loading: payload }),
    collectionRef: collection(db, 'kanban'),
    //!---------------------------------
    boards: [],
    setBoard: async (payload, id = null, userId, addColumnOrder = false) => {
        let document
        if (id) {
            const ref = doc(collection(db, `users/${userId}/boards`), id)
            document = await setDoc(ref, payload)
        } else {
            const ref = collection(db, `users/${userId}/boards`)
            document = await addDoc(ref, payload)
        }
        if (addColumnOrder) {
            const columnOrder = { id: 'columnOrder', order: [] }
            get().setColumnOrder(columnOrder, userId, document.id)
        }
    },
    getBoards: async (userId) => {
        // const docRef = doc(db, 'users', userId)
        // const docSnap = await getDoc(docRef)
        onSnapshot(collection(db, `users/${userId}/boards`), (snapshot) => {
            // console.log(snapshot.docs.length)
            const documents = []
            snapshot.forEach((doc) => documents.push({ id: doc.id, ...doc.data() }))
            set({ boards: documents })
        })
    },
    deleteBoard: async (id, userId) => {
        const ref = doc(db, `users/${userId}/boards`, id)
        await deleteDoc(ref)
    },
    //!---------------------------------
    setColumnOrder: async (payload, userId, boardId) => {
        const ref = doc(collection(db, `users/${userId}/boards/${boardId}/columns`), 'columnOrder')
        await setDoc(ref, payload)
    },
    deleteCol: (payload) => {},
    //!---------------------------------

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
