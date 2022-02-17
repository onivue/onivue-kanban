import Button from '../Button/Button'
import Link from 'next/link'

const Unathorized = () => {
    return (
        <div className="flex flex-1 flex-col justify-center">
            <div className="grid justify-items-center lg:grid-cols-2">
                <div className="p-4 lg:p-8">
                    <img src="img/alert.svg" />
                </div>
                <div className="py-4">
                    <h2 className="mb-4 text-center text-4xl font-extrabold tracking-tight md:text-6xl">
                        This page is just for authorized Users.
                    </h2>

                    <Link href="/auth/login">
                        <a className="mx-auto mt-12 grid w-1/2 grid-cols-1 gap-4">
                            <Button style="secondary">Login</Button>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Unathorized
