import Head from 'next/head'

import useAuthStore from '@/stores/useAuthStore'

export default function Home() {
    const user = useAuthStore((state) => state.user)
    const loading = useAuthStore((state) => state.loading)
    const logout = useAuthStore((state) => state.logout)

    return (
        <div className="flex flex-1 flex-col justify-center">
            <Head>
                <title>onivue-kanban</title>
            </Head>

            {/* <Link href="/boards"></Link> */}
            <div className="grid justify-items-center lg:grid-cols-2">
                <div className="p-4 lg:p-8">
                    <img src="img/tasks.svg" alt="" />
                </div>
                <div className="py-4">
                    <h2 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">
                        Simplified{' '}
                        <span className="bg-gradient-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">
                            Kanban
                        </span>{' '}
                        planner for personal use that helps you organize your tasks.
                    </h2>
                </div>
            </div>
        </div>
    )
}
