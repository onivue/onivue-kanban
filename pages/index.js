import Head from 'next/head'

import useAuthStore from '@/stores/useAuthStore'
import Link from 'next/link'

export default function Home() {
    const user = useAuthStore((state) => state.user)
    const loading = useAuthStore((state) => state.loading)
    const logout = useAuthStore((state) => state.logout)

    return (
        <div className="flex flex-col items-center justify-center py-2 ">
            <Head>
                <title>Firebase zustand nextjs example</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {user && (
                <>
                    <button
                        onClick={() => logout()}
                        className="rounded-lg bg-blue-700 px-3 py-2 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        LOGOUT
                    </button>
                    <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
                        <h1 className="w-full break-all text-6xl font-bold">{JSON.stringify(user.email)}</h1>
                    </div>
                </>
            )}

            {!user && (
                <>
                    <Link href="/auth/login">
                        <a className="rounded-lg bg-blue-700 px-3 py-2 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            LOGIN
                        </a>
                    </Link>
                    <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
                        <h1 className="text-6xl font-bold text-red-600">LOGGED OFF </h1>
                    </div>
                </>
            )}

            <div className="mx-auto max-w-7xl">
                <div className="group relative">
                    <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 opacity-25 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200" />
                    <div className="items-top relative flex justify-start space-x-6 rounded-lg bg-white px-7 py-6 leading-none ring-1 ring-gray-900/5">
                        <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24">
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M6.75 6.75C6.75 5.64543 7.64543 4.75 8.75 4.75H15.25C16.3546 4.75 17.25 5.64543 17.25 6.75V19.25L12 14.75L6.75 19.25V6.75Z"
                            />
                        </svg>
                        <div className="space-y-2">
                            <p className="text-slate-800">Learn how to make a glowing gradient background!</p>
                            <a
                                href="https://braydoncoyer.dev/blog/tailwind-gradients-how-to-make-a-glowing-gradient-background"
                                className="block text-indigo-400 transition duration-200 group-hover:text-slate-800"
                                target="_blank"
                            >
                                Read Article →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
