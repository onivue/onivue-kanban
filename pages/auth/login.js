import { useState } from 'react'
import useAuthStore from '@/stores/useAuthStore'
import Button from '@/components/Button/Button'
import Link from 'next/link'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const login = useAuthStore((state) => state.login)
    const errorMessage = useAuthStore((state) => state.errorMessage)

    return (
        <div className="flex w-full flex-1 items-center justify-center">
            <div className=" w-full max-w-md  rounded-lg bg-white px-8 py-12">
                <form className="flex flex-col justify-around space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium ">
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
                                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 "
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium ">
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
                                className="block w-full appearance-none rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 "
                            />
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="mt-3 rounded-lg border-2 border-red-400 bg-red-200 p-3 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}

                    <Button
                        label="login"
                        className="w-full"
                        // loading={loading}
                        onClick={async (e) => {
                            e.preventDefault()
                            login(email, password)
                        }}
                    >
                        LOGIN
                    </Button>
                    <div className="flex  justify-between text-sm text-gray-400">
                        <Link href="/auth/resetpassword">
                            <a>Forgot your password?</a>
                        </Link>
                        <Link href="/auth/register">
                            <a>Register here</a>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginForm
