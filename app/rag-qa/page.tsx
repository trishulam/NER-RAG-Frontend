'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Send } from 'lucide-react'

type ModelProvider = 'openai' | 'llama'

interface RAGResponse {
  answer: string
  document: string
  reasoning_steps?: string[]  // Make this optional
}

export default function RAGQAPage() {
  const [question, setQuestion] = useState('')
  const [modelProvider, setModelProvider] = useState<ModelProvider>('openai')
  const [response, setResponse] = useState<RAGResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      const result = await axios.post('http://localhost:8080/rag', { query: question, provider: modelProvider })
      setResponse(result.data)
    } catch (err) {
      setError('An error occurred while fetching the response. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white shadow-xl rounded-lg overflow-hidden">
          <CardHeader className="bg-gray-800  text-white p-6">
            <CardTitle className="text-2xl font-bold">RAG Question & Answer</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="model-select" className="block text-sm font-medium text-gray-700">
                  Select Model Provider
                </label>
                <Select onValueChange={(value: ModelProvider) => setModelProvider(value)} value={modelProvider}>
                  <SelectTrigger id="model-select" className="w-full">
                    <SelectValue placeholder="Choose a model provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="llama">LLama 3.2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="question-input" className="block text-sm font-medium text-gray-700">
                  Your Question
                </label>
                <div className="flex gap-2">
                  <Input
                    id="question-input"
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-grow"
                  />
                  <Button type="submit" disabled={isLoading || !question.trim()}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
          {error && (
            <CardFooter className="bg-red-50 p-6">
              <p className="text-red-600">{error}</p>
            </CardFooter>
          )}
          {response && (
            <CardFooter className="bg-gray-50 p-6">
              <div className="space-y-4 w-full">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Answer</h3>
                  <p className="text-gray-600 mt-2">{response.answer}</p>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-700">Source Document</h4>
                  <div className="bg-white p-4 rounded-md border border-gray-200 mt-2">
                    <p className="text-sm text-gray-500 whitespace-pre-wrap">{response.document}</p>
                  </div>
                </div>
                {response.reasoning_steps && response.reasoning_steps.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-700">Reasoning Steps</h4>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {response.reasoning_steps.map((step, index) => (
                        <li key={index} className="text-sm text-gray-600">{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

