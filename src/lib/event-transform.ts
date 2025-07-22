import type { Event, User, EventAttendee, EventReminder, EventTag, Tag } from "@prisma/client"

// Type for event with all relations
export type EventWithRelations = Event & {
  creator: User
  attendees: (EventAttendee & { user: User })[]
  reminders: EventReminder[]
  tags: (EventTag & { tag: Tag })[]
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
    organizer: event.creator.name || event.creator.email,
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
export function transformEventForDatabase(eventData: unknown) {
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
    isOnline: eventData.location?.toLowerCase().includes("online") || false,
    maxAttendees: eventData.attendees ? Number(eventData.attendees) : null,
  }
}
