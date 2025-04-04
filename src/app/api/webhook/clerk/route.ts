import { Webhook } from "svix"
import { headers } from "next/headers"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    // Get the headers
    const headersList = await headers()
    const svixId = headersList.get("svix-id")
    const svixTimestamp = headersList.get("svix-timestamp")
    const svixSignature = headersList.get("svix-signature")

    // If there are no headers, error out
    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Error: Missing svix headers", {
        status: 400,
      })
    }

    // Get the body
    const payload: unknown = await req.json()
    const body = JSON.stringify(payload)

    // Create a new Svix instance with your webhook secret
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET
    if (!webhookSecret) {
      return new Response("Webhook secret not configured", {
        status: 500,
      })
    }

    const wh: Webhook = new Webhook(webhookSecret)
    let evt: WebhookEvent

    // Verify the webhook
    try {
      evt = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent
    } catch (err) {
      console.error("Error verifying webhook:", err)
      return new Response("Error verifying webhook", {
        status: 400,
      })
    }

    // Handle the webhook
    const eventType = evt.type

    if (eventType === "user.created") {
      const { id } = evt.data

      // Set default role as teacher if not specified
      try {
        await (await clerkClient()).users.updateUser(id, {
          publicMetadata: {
            role: "admin",
          },
        })

        console.log(`User ${id} created with default role: teacher`)
      } catch (error) {
        console.error("Error setting default role:", error)
        return new Response("Error setting default role", {
          status: 500,
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return new Response("Internal server error", {
      status: 500,
    })
  }
}

