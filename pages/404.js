import Button from '@/components/Button/Button'
import Link from 'next/link'

export default function FourOhFour() {
    return (
        <div className="flex flex-1 flex-col justify-center">
            <div className="grid justify-items-center lg:grid-cols-2">
                <div className="p-4 lg:p-8">
                    <img src="img/404.svg" />
                </div>
                <div className="py-4">
                    <h2 className="mb-4 text-center text-4xl font-extrabold tracking-tight md:text-6xl">
                        404 - Page Not Found
                    </h2>

                    <Link href="/auth/login">
                        <a className="mx-auto mt-12 grid w-1/2 grid-cols-1 gap-4">
                            <Button style="secondary">Go back</Button>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    )
}
