import type { Event, User, EventAttendee, EventReminder, EventTag, Tag } from "@prisma/client"

// Type for event with all relations
export type EventWithRelations = Event & {
  creator: User
  attendees: (EventAttendee & { user: User })[]
  reminders: EventReminder[]
  tags: (EventTag & { tag: Tag })[]
}

// Frontend event data type
export interface FrontendEventData {
  title: string
  description?: string
  date: string
  startTime: string
  endTime: string
  location?: string
  type: string
  priority: string
  status: string
  recurring: string
  notes?: string
  attendees?: number
}

// Transform Prisma event to frontend format
export function transformEventForFrontend(event: EventWithRelations) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    type: event.type.toLowerCase(),
    date: event.date.toISOString().split("T")[0],
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location,
    attendees: event.attendees.length,
    priority: event.priority.toLowerCase(),
    recurring: event.recurring.toLowerCase(),
    // Fix: Use username instead of name, with fallback to email
    organizer: event.creator.username ?? event.creator.email,
    status: event.status.toLowerCase(),
    reminders: event.reminders.map((r) => `${r.value} minutes before`),
    notes: event.notes,
    tags: event.tags.map((et) => ({
      id: et.tag.id,
      name: et.tag.name,
      color: et.tag.color,
    })),
  }
}

// Transform frontend event data to Prisma format
export function transformEventForDatabase(eventData: FrontendEventData) {
  return {
    title: eventData.title,
    description: eventData.description,
    date: new Date(eventData.date),
    startTime: eventData.startTime,
    endTime: eventData.endTime,
    location: eventData.location,
    type: eventData.type.toUpperCase(),
    priority: eventData.priority.toUpperCase(),
    status: eventData.status.toUpperCase(),
    recurring: eventData.recurring.toUpperCase(),
    notes: eventData.notes,
    isOnline: eventData.location?.toLowerCase().includes("online") ?? false,
    maxAttendees: eventData.attendees ? Number(eventData.attendees) : null,
  }
}

// Type guard to validate frontend event data
export function isValidFrontendEventData(data: unknown): data is FrontendEventData {
  if (typeof data !== "object" || data === null) {
    return false
  }

  const eventData = data as Record<string, unknown>

  return (
    typeof eventData.title === "string" &&
    typeof eventData.date === "string" &&
    typeof eventData.startTime === "string" &&
    typeof eventData.endTime === "string" &&
    typeof eventData.type === "string" &&
    typeof eventData.priority === "string" &&
    typeof eventData.status === "string" &&
    typeof eventData.recurring === "string"
  )
}

// Safe transform function with validation
export function safeTransformEventForDatabase(eventData: unknown) {
  if (!isValidFrontendEventData(eventData)) {
    throw new Error("Invalid event data format")
  }

  return transformEventForDatabase(eventData)
}
