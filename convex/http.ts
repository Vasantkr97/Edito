import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api } from "./_generated/api";

const http = httpRouter();

console.log("coming from clerk")

http.route({
    path: "/clerk-webhook",
    method: "POST",
    
    handler: httpAction(async (ctx, request) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        console.log("webhook secret loaded:" , !!webhookSecret)
        if (!webhookSecret) {
            console.log("Missging the Clerk_Webhook_Secret")
            return new Response("Missing Clerk_WEBHOOK_SECRET environment variable", { status: 500 });
        }
      
        const svix_id = request.headers.get("svix_id");
        const svix_signature = request.headers.get("svix-signature");
        const svix_timestamp = request.headers.get("svix_timestamp");

        if (!svix_id || !svix_signature || !svix_timestamp) {
            return new Response("Error ocuured -- no svix headers", {
                status: 400,
            })
        }

        const payload = await request.json();
        console.log("payload received:", payload);
        const body = JSON.stringify(payload);

        const wh = new Webhook(webhookSecret);

        let evt: WebhookEvent;

        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            }) as WebhookEvent;
        } catch (err) {
            console.log("error verify webhook:", err);
            return new Response("Error Occured", { status: 400});
        }

        const eventType = evt.type;
        console.log("Webhook event type", eventType)
        if (eventType === "user.created") {
            const { id, email_addresses, first_name, last_name } = evt.data;

            const email = email_addresses[0].email_address;
            const name = `${first_name || ""} ${last_name || ""}`.trim();

            console.log("Calling syncUser mutation with:", {
                userId: id,
                email,
                name,
              });

            try {
                await ctx.runMutation(api.users.syncUser, {
                    userId: id,
                    email,
                    name,
                })

            } catch (error) {
                console.log("Error creating User:", error);
                return new Response("Error creating user", { status: 500 });
            }
        };

        return new Response("Webhook processed successfully", { status: 200 });
    }) 
});

export default http;