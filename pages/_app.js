import '@/styles/globals.css'
import useAuthStore from '@/stores/useAuthStore'
import shallow from 'zustand/shallow'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

function MyApp({ Component, pageProps }) {
    const router = useRouter()
    const { loading, user, authListener } = useAuthStore((state) => ({
        loading: state.loading,
        user: state.user,
        authListener: state.authListener,
    }))
    /* MANDATORY FOR AUTH SYSTEM */
    useEffect(() => {
        let unsubscribe
        const getSubscribe = () => {
            unsubscribe = authListener()
        }
        getSubscribe()
        return () => {
            unsubscribe()
        }
    }, [])

    /* IF USER IS AUTHENTICATED REDIRECT AUTH PAGES ... */
    useEffect(() => {
        if (user) {
            if (
                router.pathname === '/auth/register' ||
                router.pathname === '/auth/resetpassword' ||
                router.pathname === '/auth/login'
            ) {
                router.push('/')
            }
        }
        // console.log(router)
    }, [user])

    // if (loading) {
    //     return <div> loading</div>
    // }
    return (
        <>
            <Header />
            <div className="flex min-h-screen  flex-col pt-[60px]">
                <main className="flex w-full max-w-[1900px]  flex-1 justify-center  lg:flex-row ">
                    {!user &&
                    !loading &&
                    router.pathname !== '/auth/register' &&
                    router.pathname !== '/auth/resetpassword' &&
                    router.pathname !== '/auth/login' &&
                    router.pathname !== '/' &&
                    router.pathname !== '/_error' ? (
                        <div className="flex flex-col self-center ">
                            <Link href="/auth/login">
                                <a className="rounded-lg bg-blue-700 px-3 py-2 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    LOGIN
                                </a>
                            </Link>
                        </div>
                    ) : (
                        !loading && <Component {...pageProps} />
                    )}
                </main>
                <Footer />
            </div>
        </>
    )
}

export default MyApp
