import '@/styles/globals.css'
import useAuthStore from '@/stores/useAuthStore'
import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Unathorized from '@/components/Unauthorized/Unathorized'
import Head from 'next/head'

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

    const [isRouterReady, setIsRouterReady] = useState(true)

    /* IF USER IS AUTHENTICATED REDIRECT AUTH PAGES ... */
    useEffect(() => {
        if (user) {
            if (
                router.pathname === '/auth/register' ||
                router.pathname === '/auth/resetpassword' ||
                router.pathname === '/auth/login'
            ) {
                router.push('/boards')
            }
            setIsRouterReady(true)
        }
        // console.log(router)
    }, [user, router])

    // if (loading) {
    //     return <div> loading</div>
    // }
    const variants = {
        hidden: { opacity: 0, x: -200, y: 0, transition: { duration: 0.3 } },
        enter: { opacity: [0, 0, 1], x: 0, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: 0, y: -100 },
    }
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no ,height=device-height"
                />
                <title>onivue-kanban</title>
            </Head>
            {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}> */}
            <Header />
            {isRouterReady && null}
            <div className="flex min-h-screen flex-col  items-center justify-center pt-[60px]">
                <motion.main
                    variants={variants}
                    initial="hidden"
                    animate="enter"
                    exit="exit"
                    transition={{ type: 'linear' }}
                    className="flex w-full max-w-[1900px] flex-1  flex-col  p-4 "
                    key={router.pathname}
                >
                    {router.pathname !== '/auth/register' &&
                    router.pathname !== '/auth/resetpassword' &&
                    router.pathname !== '/auth/login' &&
                    router.pathname !== '/' &&
                    router.pathname !== '/_error' &&
                    !user &&
                    !loading ? (
                        <Unathorized />
                    ) : (
                        !loading && <Component {...pageProps} />
                    )}
                </motion.main>

                <Footer />
            </div>
            {/* </ThemeProvider> */}
        </>
    )
}

export default MyApp
