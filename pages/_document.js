import Document, { Html, Head, Main, NextScript } from 'next/document'

const APP_NAME = 'onivue.'
const APP_DESCRIPTION = 'Development Area of onivue'

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <meta name="apple-mobile-web-app-title" content={APP_NAME} />
                    <meta name="description" content={APP_DESCRIPTION} />
                    <meta name="application-name" content="onivue." />
                    <meta name="theme-color" content="#a3e635" />
                    <meta charSet="utf-8" />
                    {/* <link rel="manifest" href="/manifest.json" />
                    <link rel="shortcut icon" href="/icons/favicon.ico" /> */}
                </Head>
                <body className="bg-gray-100 text-gray-900 antialiased selection:bg-green-200">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
