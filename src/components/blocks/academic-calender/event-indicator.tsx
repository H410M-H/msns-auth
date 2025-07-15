"use client"

// getEventTypeColor provides color, bgColor, borderColor, and label for each event type
interface EventIndicatorProps {
  eventType: string
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

interface EventTypeColor {
  color?: string
  bgColor: string
  borderColor: string
  label: string
}

function getEventTypeColor(eventType: string): EventTypeColor {
  // Example mapping, adjust as needed
  switch (eventType) {
    case "holiday":
      return {
        color: "text-green-700",
        bgColor: "bg-green-100",
        borderColor: "border-green-300",
        label: "Holiday",
      }
    case "exam":
      return {
        color: "text-red-700",
        bgColor: "bg-red-100",
        borderColor: "border-red-300",
        label: "Exam",
      }
    case "event":
      return {
        color: "text-blue-700",
        bgColor: "bg-blue-100",
        borderColor: "border-blue-300",
        label: "Event",
      }
    default:
      return {
        color: "text-gray-700",
        bgColor: "bg-gray-100",
        borderColor: "border-gray-300",
        label: eventType,
      }
  }
}

export default function EventIndicator({ eventType, size = "sm", showLabel = false }: EventIndicatorProps) {
  const eventColor = getEventTypeColor(eventType)

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }

  if (showLabel) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-2 py-1 rounded-md ${eventColor.bgColor} ${eventColor.borderColor} border`}
      >
        <div className={`${sizeClasses[size]} rounded-full bg-current ${eventColor.color}`} />
        <span className={`text-xs font-medium ${eventColor.color}`}>{eventColor.label}</span>
      </div>
    )
  }
}

