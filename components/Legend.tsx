import { Badge } from "@/components/ui/badge"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faUser, faCar, faMapMarkerAlt, faEnvelope, faPhone, faLink } from '@fortawesome/free-solid-svg-icons'
import { NODE_COLORS, LINK_COLORS } from '@/app/styles/colors'

const ICONS = {
  event: faCalendarAlt,
  person: faUser,
  vehicle: faCar,
  location: faMapMarkerAlt,
  email: faEnvelope,
  phone: faPhone,
}

const LINK_TYPES = {
  'person_to_person': 'Person to Person',
  'person_to_vehicle': 'Person to Vehicle',
  'person_to_event': 'Person to Event',
  'location_to_event': 'Location to Event',
  'vehicle_to_event': 'Vehicle to Event',
}

export default function Legend() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg max-w-[250px] text-sm">
      <h3 className="font-semibold mb-3 text-base text-gray-800">Legend</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2 text-sm text-gray-600">Nodes</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(NODE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center space-x-2">
                <Badge style={{ backgroundColor: color }} className="w-6 h-6 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={ICONS[type as keyof typeof ICONS]} className="text-white" size="sm" />
                </Badge>
                <span className="capitalize text-xs text-gray-700">{type.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2 text-sm text-gray-600">Relationships</h4>
          <div className="grid grid-cols-1 gap-1">
            {Object.entries(LINK_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center space-x-2">
                <Badge style={{ backgroundColor: color }} className="w-6 h-6 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faLink} className="text-white" size="sm" />
                </Badge>
                <span className="text-xs text-gray-700">{LINK_TYPES[type as keyof typeof LINK_TYPES]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

