import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NER Force Graph & RAG Q&A',
  description: 'Interactive force-directed graph for named entity recognition and RAG-based Q&A system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50`}>
            <nav className="bg-gray-800 shadow-lg">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center h-16">
                  <div className="flex items-center space-x-8">
                    <Link 
                      href="/" 
                      className="text-white hover:text-gray-300 inline-flex items-center px-3 py-2 text-sm font-medium"
                    >
                      NER Graph
                    </Link>
                    <Link 
                      href="/rag-qa" 
                      className="text-white hover:text-gray-300 inline-flex items-center px-3 py-2 text-sm font-medium"
                    >
                      RAG Q&A
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          <main>
            {children}
          </main>
      </body>
    </html>
  )
}

