import { z } from "zod"

// Enum schemas
export const EventTypeSchema = z.enum(["MEETING", "WORKSHOP", "CONFERENCE", "TRAINING", "WEBINAR", "SOCIAL", "OTHER"])

export const PrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"])

export const EventStatusSchema = z.enum(["CONFIRMED", "TENTATIVE", "CANCELLED"])

export const RecurrenceTypeSchema = z.enum(["NONE", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"])

export const AttendeeStatusSchema = z.enum(["PENDING", "ACCEPTED", "DECLINED", "MAYBE"])

export const ReminderTypeSchema = z.enum(["EMAIL", "PUSH", "SMS"])

// Time validation helper
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

// Core event schemas
export const CreateEventSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    description: z.string().max(1000, "Description too long").optional(),

    // Date and time
    date: z.string().datetime("Invalid date format"),
    startTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
    endTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)"),
    timezone: z.string().default("UTC"),

    // Location
    location: z.string().max(200, "Location too long").optional(),
    isOnline: z.boolean().default(false),

    // Event details
    type: EventTypeSchema,
    priority: PrioritySchema.default("MEDIUM"),
    status: EventStatusSchema.default("CONFIRMED"),

    // Recurrence
    recurring: RecurrenceTypeSchema.default("NONE"),
    recurrenceEnd: z.string().datetime().optional(),

    // Metadata
    maxAttendees: z.number().int().positive().max(10000).optional(),
    isPublic: z.boolean().default(false),
    notes: z.string().max(2000, "Notes too long").optional(),

    // Reminders
    reminders: z
      .array(
        z.object({
          type: ReminderTypeSchema,
          value: z.number().int().positive().max(43200), // Max 30 days in minutes
        }),
      )
      .default([]),

    // Tags
    tagIds: z.array(z.string().cuid()).default([]),
  })
  .refine(
    (data) => {
      // Validate end time is after start time
      const start = new Date(`2000-01-01T${data.startTime}:00`)
      const end = new Date(`2000-01-01T${data.endTime}:00`)
      return end > start
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  )

export const UpdateEventSchema = CreateEventSchema.partial().extend({
  id: z.string().cuid(),
})

export const EventQuerySchema = z.object({
  id: z.string().cuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  type: EventTypeSchema.optional(),
  priority: PrioritySchema.optional(),
  status: EventStatusSchema.optional(),
  creatorId: z.string().cuid().optional(),
  search: z.string().max(100).optional(),
  limit: z.number().int().positive().max(100).default(50),
  offset: z.number().int().nonnegative().default(0),
})

export const DeleteEventSchema = z.object({
  id: z.string().cuid(),
})

// Attendee schemas
export const AddAttendeeSchema = z.object({
  eventId: z.string().cuid(),
  userId: z.string().cuid(),
  status: AttendeeStatusSchema.default("PENDING"),
})

export const UpdateAttendeeStatusSchema = z.object({
  eventId: z.string().cuid(),
  userId: z.string().cuid(),
  status: AttendeeStatusSchema,
})

// Tag schemas
export const CreateTagSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(50, "Tag name too long"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color format"),
})

export const UpdateTagSchema = CreateTagSchema.partial().extend({
  id: z.string().cuid(),
})

// Type exports
export type CreateEventInput = z.infer<typeof CreateEventSchema>
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>
export type EventQueryInput = z.infer<typeof EventQuerySchema>
export type DeleteEventInput = z.infer<typeof DeleteEventSchema>
export type AddAttendeeInput = z.infer<typeof AddAttendeeSchema>
export type UpdateAttendeeStatusInput = z.infer<typeof UpdateAttendeeStatusSchema>
export type CreateTagInput = z.infer<typeof CreateTagSchema>
export type UpdateTagInput = z.infer<typeof UpdateTagSchema>
