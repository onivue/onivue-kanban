import React, { useCallback, useEffect, useState } from 'react'
// import LogoIcon from '../LogoIcon/LogoIcon'
import Link from 'next/link'

import { useRouter } from 'next/router'
// import { useTheme } from 'next-themes'
import { HiMoon, HiSun } from 'react-icons/hi'
import classNames from 'classnames'

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

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    // const toggleTheme = useCallback(() => {
    //     console.log(theme)

    //     setTheme(theme === Themes.light ? Themes.dark : Themes.light)
    // }, [setTheme, theme])

    return (
        <nav
            className={classNames(
                'dark:bg-dark-100 fixed inset-0 z-10 h-[60px] bg-white bg-opacity-80 backdrop-blur-sm backdrop-filter  duration-300     ',
                visible
                    ? 'border-primary-200 top-0 border-b'
                    : 'border-primary-200 -top-[55px] rounded-lg border-b-[5px] border-opacity-100',
            )}
        >
            {isClient && (
                <div className="mx-auto flex h-full max-w-[1900px] flex-nowrap items-center">
                    <div className="relative flex h-full w-full items-center justify-between px-3 py-2 lg:py-3">
                        <div className="flex items-center">
                            <Link href="/">
                                <a href="">{/* <LogoIcon className="h-10 w-10" /> */}</a>
                            </Link>
                            {/* <div className="ml-4 font-mono text-xl ">ONIVUE-RESUME</div> */}
                        </div>
                        <div className="flex">
                            {/* <button onClick={toggleTheme} className="mx-4 opacity-50">
                                {theme === Themes.light ? (
                                    <HiMoon className="h-6 w-6 " />
                                ) : (
                                    <HiSun className="h-6 w-6" />
                                )}
                            </button> */}
                            <div className="divide-primary-200 flex items-center divide-x-2 text-sm">
                                <Link href="/">
                                    <a
                                        className={`hover:text-primary-500 px-2 ${
                                            router.pathname === '/' && 'text-primary-500'
                                        }`}
                                    >
                                        home
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Header
