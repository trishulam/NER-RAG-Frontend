import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X } from 'lucide-react'
import { LINK_COLORS } from '@/app/styles/colors'

interface LinkInfoPanelProps {
  link: any
  onClose: () => void
}

export default function LinkInfoPanel({ link, onClose }: LinkInfoPanelProps) {
  const formatRelationType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace('Relations', '')
  }

  const relationshipType = formatRelationType(link.properties.relationship_type)
  const linkColor = LINK_COLORS[link.properties.relationship_type.split('_').slice(0, -1).join('_')] || '#94A3B8'

  return (
    <Card className="fixed bottom-4 right-4 w-80 max-w-[calc(100vw-2rem)] shadow-lg overflow-hidden bg-white">
      <CardHeader className="flex flex-row items-center justify-between p-4" style={{ backgroundColor: linkColor }}>
        <CardTitle className="text-white text-lg font-medium">
          {relationshipType}
        </CardTitle>
        <button 
          onClick={onClose} 
          className="text-white hover:text-gray-200 focus:outline-none transition-colors"
        >
          <X size={18} />
        </button>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-48 max-h-[calc(100vh-16rem)]">
          <div className="space-y-4">
            {link.properties?.type && (
              <div className="text-sm">
                <span className="font-medium text-gray-700">Type:</span>{' '}
                <span className="text-gray-900">{link.properties.type}</span>
              </div>
            )}
            {link.properties?.note && (
              <div className="text-sm">
                <span className="font-medium text-gray-700">Note:</span>{' '}
                <span className="text-gray-900">{link.properties.note}</span>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

