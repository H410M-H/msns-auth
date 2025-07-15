"use client"

import { useState } from "react"
import { EVENT_TYPES } from "./event-colors"
import EventIndicator from "./event-indicator"
import EventDetailsModal, { type EventDetails } from "./event-details-modal"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"

const SAMPLE_EVENTS: EventDetails[] = [
  {
    id: 1,
    title: "Team Standup",
    description:
      "Daily standup meeting to discuss progress, blockers, and plan for the day. All team members are expected to attend.",
    type: "meeting",
    date: "2025-07-05",
    startTime: "09:00",
    endTime: "09:30",
    location: "Conference Room A",
    attendees: 8,
    priority: "medium",
    recurring: "daily",
    organizer: "Sarah Johnson",
    status: "confirmed",
    reminders: ["15 minutes before", "5 minutes before"],
    notes: "Please prepare your updates beforehand. Meeting will be recorded for remote team members.",
  },
  {
    id: 2,
    title: "React Workshop",
    description:
      "Comprehensive workshop covering React hooks, state management, and best practices. Hands-on coding session with real-world examples.",
    type: "workshop",
    date: "2025-07-05",
    startTime: "14:00",
    endTime: "17:00",
    location: "Training Center",
    attendees: 25,
    priority: "high",
    recurring: "none",
    organizer: "Mike Chen",
    status: "confirmed",
    reminders: ["1 day before", "1 hour before"],
    notes: "Bring your laptop with Node.js installed. Materials will be provided via email.",
  },
  {
    id: 3,
    title: "Tech Conference 2025",
    description:
      "Annual technology conference featuring keynote speakers, technical sessions, and networking opportunities. Focus on emerging technologies and industry trends.",
    type: "conference",
    date: "2025-07-06",
    startTime: "09:00",
    endTime: "18:00",
    location: "Convention Center",
    attendees: 500,
    priority: "high",
    recurring: "yearly",
    organizer: "Event Team",
    status: "confirmed",
    reminders: ["1 week before", "1 day before", "2 hours before"],
    notes: "Registration required. Lunch and refreshments provided. Parking available on-site.",
  },
  {
    id: 4,
    title: "Security Training",
    description:
      "Mandatory cybersecurity training covering phishing awareness, password security, and data protection protocols.",
    type: "training",
    date: "2025-07-07",
    startTime: "10:00",
    endTime: "12:00",
    location: "Online",
    attendees: 50,
    priority: "urgent",
    recurring: "none",
    organizer: "IT Security Team",
    status: "confirmed",
    reminders: ["3 days before", "1 day before", "30 minutes before"],
    notes: "Attendance is mandatory for all employees. Certificate will be issued upon completion.",
  },
  {
    id: 5,
    title: "Product Demo Webinar",
    description:
      "Live demonstration of our new product features and capabilities. Q&A session included for customer feedback.",
    type: "webinar",
    date: "2025-07-08",
    startTime: "15:00",
    endTime: "16:00",
    location: "Zoom",
    attendees: 100,
    priority: "medium",
    recurring: "monthly",
    organizer: "Product Team",
    status: "confirmed",
    reminders: ["1 day before", "1 hour before"],
    notes: "Recording will be available for those who cannot attend live. Registration link sent via email.",
  },
  {
    id: 6,
    title: "Team Happy Hour",
    description:
      "Monthly team social event to celebrate achievements and strengthen team bonds. Food and drinks provided.",
    type: "social",
    date: "2025-07-09",
    startTime: "17:00",
    endTime: "19:00",
    location: "Local Pub",
    attendees: 15,
    priority: "low",
    recurring: "monthly",
    organizer: "HR Team",
    status: "tentative",
    reminders: ["2 days before"],
    notes: "Optional attendance. Please RSVP by July 7th for catering purposes.",
  },
]

export default function SampleEvents() {
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleEventClick = (event: EventDetails) => {
    setSelectedEvent(event)
    setIsDetailsOpen(true)
  }

  const handleEdit = (event: EventDetails) => {
    console.log("Edit event:", event)
    setIsDetailsOpen(false)
    // Here you would open the edit modal
  }

  const handleDelete = (eventId: number) => {
    console.log("Delete event:", eventId)
    // Here you would remove the event from your data store
  }

  const handleDuplicate = (event: EventDetails) => {
    console.log("Duplicate event:", event)
    setIsDetailsOpen(false)
    // Here you would create a copy of the event
  }

  return (
    <>
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SAMPLE_EVENTS.map((event) => {
            const eventColor = EVENT_TYPES.find((type) => type.id === event.type)!
            return (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className={`p-4 rounded-lg ${eventColor.bgColor} ${eventColor.borderColor} border transition-all hover:scale-[1.01] cursor-pointer group`}
              >
                <div className="flex items-start gap-3">
                  <EventIndicator eventType={event.type} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium ${eventColor.color} mb-1 group-hover:underline`}>{event.title}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.startTime} - {event.endTime}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{event.description}</p>
                    )}
                  </div>
                  <EventIndicator eventType={event.type} showLabel />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      <EventDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        event={selectedEvent}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
    </>
  )
}
