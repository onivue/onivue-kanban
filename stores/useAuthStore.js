import create from 'zustand'
import { auth } from '@/lib/firebase'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    deleteUser,
    signOut,
    updatePassword,
    updateProfile,
} from 'firebase/auth'

const useAuthStore = create((set, get) => ({
    user: null,
    loading: true,
    errorMessage: null,
    setLoading: (payload) => set({ loading: payload }),
    setUser: (payload) => set({ user: payload }),
    authListener: (router) => {
        onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                // console.log('LOGGED IN', authUser)
                set({ user: authUser })
                set({ loading: false })
                // db.collection('users')
                //     .where('id', '==', authUser.uid)
                //     .onSnapshot((snapshot) => {
                //         snapshot.docs.map((doc) => setUserData(doc.data()))
                //         if (snapshot.docs.length === 0) {
                //             console.log('WARNING: User could not be found in Collection "users"')
                //         }
                //         setLoading(false)
                //     })
            } else {
                // console.log('NO')
                set({ user: null })
                set({ loading: false })
                // setTimeout(() => { set({ loading: false })}, 2000)
            }
        })
    },
    login: async (email, password) => {
        try {
            set({ loading: true })
            await signInWithEmailAndPassword(auth, email, password)
            set({ loading: false })
        } catch (err) {
            // console.log(err.code)
            // console.log(err.message)
            if (err.code === 'auth/wrong-password') {
                set({ errorMessage: 'Please check the Password' })
            }
            if (err.code === 'auth/user-not-found') {
                set({ errorMessage: 'Please check the Email' })
            }
            if (err.code === 'auth/invalid-email') {
                set({ errorMessage: 'Please check the Email' })
            }
            set({ loading: false })
        }
    },
    logout: async () => {
        try {
            set({ loading: true })
            await signOut(auth)
            set({ loading: false })
        } catch (err) {
            set({ errorMessage: err.message })
            set({ loading: false })
        }
    },
    register: async (email, password, username) => {
        try {
            set({ loading: true })
            await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(auth.currentUser, {
                displayName: username,
                photoURL:
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1174&q=80',
            })
            set({ loading: false })
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') {
                set({ errorMessage: 'Email Already in Use' })
            }
            set({ loading: false })
        }
    },
    resetPassword: async (email) => {
        try {
            set({ loading: true })
            await sendPasswordResetEmail(auth, email)
            set({ loading: false })
        } catch (err) {
            set({ errorMessage: err.message })
            set({ loading: false })
        }
    },
    updatePassword: async (newPassword) => {
        try {
            set({ loading: true })
            await updatePassword(auth.currentUser, newPassword)
            set({ loading: false })
        } catch (err) {
            set({ errorMessage: err.message })
            set({ loading: false })
        }
    },
    deleteAccount: async () => {
        try {
            set({ loading: true })
            await deleteUser(auth.currentUser)
            set({ loading: false })
        } catch (err) {
            set({ errorMessage: err.message })
            set({ loading: false })
        }
    },
}))

export default useAuthStore
