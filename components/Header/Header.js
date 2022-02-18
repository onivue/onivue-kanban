import React, { useCallback, useEffect, useState } from 'react'
import LogoIcon from '@/components/LogoIcon/LogoIcon'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { HiMoon, HiOutlineLogin, HiOutlineLogout, HiSun } from 'react-icons/hi'
import classNames from 'classnames'
import Button from '../Button/Button'
import useAuthStore from '@/stores/useAuthStore'
import { AnimateSharedLayout, motion } from 'framer-motion'

export const useHeaderVisible = () => {
    const [prevScrollPos, setPrevScrollPos] = useState(0)
    const [visible, setVisible] = useState(true)
    const handleScroll = useCallback(() => {
        const currentScrollPos = window.pageYOffset
        setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10)
        setPrevScrollPos(currentScrollPos)
    }, [setVisible, setPrevScrollPos, prevScrollPos])
    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll])
    return visible
}

const Themes = {
    light: 'light',
    dark: 'dark',
}

const Header = ({ className }) => {
    const visible = useHeaderVisible()
    const router = useRouter()
    // const { theme, setTheme } = useTheme()
    const user = useAuthStore((state) => state.user)
    const loading = useAuthStore((state) => state.loading)
    const logout = useAuthStore((state) => state.logout)

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    // const toggleTheme = useCallback(() => {
    //     setTheme(theme === Themes.light ? Themes.dark : Themes.light)
    // }, [setTheme, theme])

    return (
        <nav
            className={classNames(
                'fixed inset-0 z-10 h-[60px] bg-white bg-opacity-80 backdrop-blur-sm backdrop-filter duration-300  dark:bg-dark-100     ',
                visible
                    ? 'top-0 border-b border-primary-200'
                    : '-top-[55px] rounded-lg border-b-[5px] border-primary-200 border-opacity-100',
            )}
        >
            <div className="mx-auto flex h-full max-w-[1900px] flex-nowrap items-center">
                <div className="relative flex h-full w-full items-center justify-between px-3 py-2 lg:py-3">
                    <div className="flex items-center">
                        <Link href="/">
                            <a href="">
                                <LogoIcon className="h-10 w-10" />
                            </a>
                        </Link>
                    </div>
                    <div className="flex">
                        {/* {isClient && (
                            <button onClick={toggleTheme} className="mx-4 opacity-50">
                                {theme === Themes.light ? (
                                    <HiMoon className="h-6 w-6 " />
                                ) : (
                                    <HiSun className="h-6 w-6" />
                                )}
                            </button>
                        )} */}
                        {/* <div className="flex items-center divide-x-2 divide-primary-200 text-sm">
                            <Link href="/">
                                <a
                                    className={`px-2 hover:text-primary-500 ${
                                        router.pathname === '/' && 'text-primary-500'
                                    }`}
                                >
                                    home
                                </a>
                            </Link>
                            <Link href="/boards">
                                <a
                                    className={`px-2 hover:text-primary-500 ${
                                        router.pathname === '/boards' && 'text-primary-500'
                                    }`}
                                >
                                    boards
                                </a>
                            </Link>
                        </div> */}

                        {isClient && (
                            <AnimateSharedLayout>
                                <nav className="flex items-center divide-x-2 divide-primary-200  text-sm">
                                    <Link href="/">
                                        <a className="relative flex-col px-2">
                                            home
                                            {router.pathname === '/' ? (
                                                <motion.div
                                                    layoutId="navigation-underline"
                                                    className="w-full border border-yellow-300"
                                                    animate
                                                />
                                            ) : (
                                                <div className=" w-full border border-white border-opacity-0"></div>
                                            )}
                                        </a>
                                    </Link>
                                    <Link href="/boards">
                                        <a className="relative  flex-col px-2 ">
                                            boards
                                            {router.pathname === '/boards' ? (
                                                <motion.div
                                                    layoutId="navigation-underline"
                                                    className="w-full border border-yellow-300"
                                                    animate
                                                />
                                            ) : (
                                                <div className=" w-full border border-white border-opacity-0"></div>
                                            )}
                                        </a>
                                    </Link>
                                </nav>
                            </AnimateSharedLayout>
                        )}

                        {user && !loading && (
                            <>
                                <Button size="sm" onClick={() => logout()}>
                                    <HiOutlineLogout className="h-5 w-5" />
                                </Button>
                            </>
                        )}
                        {!user && !loading && (
                            <>
                                <Link href="/auth/login">
                                    <a>
                                        <Button size="sm">
                                            <HiOutlineLogin className="h-5 w-5" />
                                        </Button>
                                    </a>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header
