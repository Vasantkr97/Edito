import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client';
import { createUser } from '@/src/db/user';
import { create } from 'domain';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // Do something with payload
  const eventType = evt.type;
  
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, created_at } = evt.data;
    const email = email_addresses?.[0]?.email_address;
    const clerkId = id;
    const userName = `${first_name || ""} ${last_name || ""}`.trim();
    const createdAt = new Date(created_at);
    try {
      const user = await createUser({clerkId,email,userName,createdAt})
      console.log(`User created: ${user.id}`)
    } catch (error) {
      console.log('Error saving user to database: ', error)
      return new Response("Error saving user to database", { status: 500 })
    }
  }

  return new Response('Webhook received', { status: 200 })
}