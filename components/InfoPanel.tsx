import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from 'lucide-react'
import { NODE_COLORS, TEXT_COLOR, CARD_BACKGROUND } from '@/app/styles/colors'
import { Badge } from "@/components/ui/badge"

interface InfoPanelProps {
  element: {
    type: 'node'
    data: any
  }
  onClose: () => void
}

export default function InfoPanel({ element, onClose }: InfoPanelProps) {
  const { type, data } = element

  return (
    <Card className="fixed bottom-4 left-4 w-80 max-w-[calc(100vw-2rem)] shadow-lg overflow-hidden bg-white">
      <CardHeader className="flex flex-row items-center justify-between p-4" style={{ backgroundColor: NODE_COLORS[data.type] }}>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs font-semibold uppercase">
            {data.type}
          </Badge>
          <CardTitle className="text-white text-lg">
            {data.label}
          </CardTitle>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200 focus:outline-none">
          <X size={20} />
        </button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-48 max-h-[calc(100vh-16rem)]">
          <div className="p-4 space-y-3">
            {Object.entries(data.properties).map(([key, value]) => (
              key !== 'id' && (
                <div key={key} className="text-sm">
                  <span className="font-medium text-gray-600 capitalize">{key}:</span>{' '}
                  <span className="text-gray-900">{String(value)}</span>
                </div>
              )
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

