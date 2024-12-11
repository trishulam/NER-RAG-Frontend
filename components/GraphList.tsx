import React from 'react'
import { Button } from "@/components/ui/button"

interface Graph {
  id: string
  title: string
}

interface GraphListProps {
  graphs: Graph[]
  onSelectGraph: (id: string) => void
}

export function GraphList({ graphs, onSelectGraph }: GraphListProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg max-w-96">
      <h3 className="text-lg font-semibold mb-4">NER Graphs</h3>
      <div className="space-y-2">
        {graphs.map((graph) => (
          <Button
            key={graph.id}
            onClick={() => onSelectGraph(graph.id)}
            variant="outline"
            className="w-full justify-start"
          >
            {graph.title}
          </Button>
        ))}
      </div>
    </div>
  )
}

