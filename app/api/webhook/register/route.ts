import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma/prisma";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        return new Response(JSON.stringify({ 
            error: "Webhook secret not configured" 
        }), { status: 500 })
    }

    const headerPayload = await headers()
    const svix_id = headerPayload.get("svix-id")
    const svix_timestamp = headerPayload.get("svix-timestamp")
    const svix_signature = headerPayload.get("svix-signature")

    if (!svix_id || !svix_signature || !svix_timestamp) {
        return new Response(JSON.stringify({ 
            error: "Missing required Svix headers" 
        }), { status: 400 })
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)

    const wh = new Webhook(WEBHOOK_SECRET)
    let evt: WebhookEvent

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error("Error verifying webhook:", err)
        return new Response(JSON.stringify({ 
            error: "Invalid webhook signature" 
        }), { status: 401 })
    }

    const { id } = evt.data
    const evtType = evt.type

    if (evtType === "user.created" && evt.data) {
        try {
            const { email_addresses, username, id } = evt.data

            if (!username) {
                return new Response(JSON.stringify({ 
                    error: "Username is required" 
                }), { status: 400 })
            }

            const response = await prisma.user.create({
                data: {
                    email: email_addresses[0].email_address,
                    clerkId: id,
                    username: username,
                }
            })


            return new Response(JSON.stringify({ 
                success: "User created successfully" 
            }), { status: 201 })

        } catch (err) {
            console.error("Database error:", err)
            return new Response(JSON.stringify({ 
                error: "Failed to create user" 
            }), { status: 500 })
        }
    } else if(evtType === "user.deleted"){
        try {
            const {id} = evt.data
        if (!id) {
            return new Response(JSON.stringify({ 
                error: "ID is required" 
            }), { status: 400 })
            }

            const response = await prisma.user.delete({
                where : {
                    clerkId : id
                }
            })


            return new Response(JSON.stringify({ 
                success: "User created successfully" 
            }), { status: 201 })
        }
        catch(err){
            console.error("Database error:", err)
            return new Response(JSON.stringify({ 
                error: "Failed to delete user" 
            }), { status: 500 })            
        }

    }

    return new Response(JSON.stringify({ 
        error: "Unsupported event type" 
    }), { status: 400 })
}