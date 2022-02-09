import { useState } from 'react'
import useAuthStore from '@/stores/useAuthStore'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const login = useAuthStore((state) => state.login)
    const errorMessage = useAuthStore((state) => state.errorMessage)

    return (
        <div className="flex w-full flex-1 items-center justify-center">
            <div className="w-full max-w-md rounded-lg bg-white px-8 py-12">
                <form className="mt-8 space-y-6" action="#" method="POST">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 "
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 "
                            />
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="mt-3 rounded-lg border-2 border-red-400 bg-red-200 p-3 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}

                    <div>
                        <button
                            label="Sign in"
                            className="rounded-full bg-green-500 px-8 py-3 text-center text-xl text-white shadow-lg shadow-green-500"
                            // loading={loading}
                            onClick={async (e) => {
                                e.preventDefault()
                                login(email, password)
                            }}
                        >
                            LOGIN
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginForm
