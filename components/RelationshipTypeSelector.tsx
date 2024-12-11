import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { LINK_COLORS } from '@/app/styles/colors'
import { useState } from 'react'
import { Link2 } from 'lucide-react'

const relationshipTypes = [
  { value: "person_to_person", label: "Person to Person" },
  { value: "person_to_vehicle", label: "Person to Vehicle" },
  { value: "person_to_event", label: "Person to Event" },
  { value: "location_to_event", label: "Location to Event" },
  { value: "vehicle_to_event", label: "Vehicle to Event" },
]

interface RelationshipTypeSelectorProps {
  selectedTypes: string[]
  onChange: (types: string[]) => void
}

export function RelationshipTypeSelector({ selectedTypes, onChange }: RelationshipTypeSelectorProps) {
  const [selectAll, setSelectAll] = useState(selectedTypes.length === relationshipTypes.length)

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    onChange(checked ? relationshipTypes.map(type => type.value) : [])
  }

  const handleCheckboxChange = (type: string) => {
    const updatedTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type]
    onChange(updatedTypes)
    setSelectAll(updatedTypes.length === relationshipTypes.length)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Relationship Types</h3>
      <div className="flex items-center space-x-2 mb-2">
        <Checkbox
          id="select-all"
          checked={selectAll}
          onCheckedChange={handleSelectAll}
        />
        <Label
          htmlFor="select-all"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Select All
        </Label>
      </div>
      {relationshipTypes.map((type) => (
        <div key={type.value} className="flex items-center space-x-2">
          <Checkbox
            id={type.value}
            checked={selectAll || selectedTypes.includes(type.value)}
            onCheckedChange={() => handleCheckboxChange(type.value)}
          />
          <Label
            htmlFor={type.value}
            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
          >
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: LINK_COLORS[type.value] }}
            >
              <Link2 size={10} color="white" />
            </div>
            <span>{type.label}</span>
          </Label>
        </div>
      ))}
    </div>
  )
}

