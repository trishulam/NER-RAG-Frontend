import React, { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TextInputModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (text: string, provider: string) => void
}

export function TextInputModal({ isOpen, onClose, onSubmit }: TextInputModalProps) {
  const [provider, setProvider] = useState('')
  const [text, setText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setText(content)
      }
      reader.readAsText(file)
    }
  }


  const handleSubmit = () => {
    onSubmit(text, provider)
    setText('')
    setProvider('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Text or File</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file-upload" className="col-span-4">
              Upload File
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="col-span-4"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="select-input" className="col-span-4">
              Select Provider
            </Label>
            <Select onValueChange={(value) => setProvider(value)}>
              <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
              <SelectGroup>
                <SelectLabel>Provider</SelectLabel>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="llama">Phi3</SelectItem>
              </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="text-input" className="col-span-4">
              Or Enter Text
            </Label>
            <Textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here..."
              className="col-span-4"
              rows={10}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

