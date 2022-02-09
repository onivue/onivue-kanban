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
                        <h1 className="w-full break-all text-6xl font-bold">
                            {JSON.stringify(user.email)}
                        </h1>
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
        </div>
    )
}
