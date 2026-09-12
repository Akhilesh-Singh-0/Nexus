import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { prisma } from "@nexus/db";

export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const { id, email_addresses, primary_email_address_id, first_name, last_name, image_url } =
      evt.data;

    const primaryEmail = email_addresses?.find(
      (e) => e.id === primary_email_address_id
    );
    const email = primaryEmail?.email_address;

    if (!email) {
      console.error("Webhook payload missing primary email for user:", id);
      return new Response("Missing primary email", { status: 400 });
    }

    const name = [first_name, last_name].filter(Boolean).join(" ") || null;

    await prisma.user.upsert({
      where: { clerkId: id },
      update: { email, name, imageUrl: image_url },
      create: { clerkId: id, email, name, imageUrl: image_url },
    });

    console.log(`Synced user ${id} (${evt.type})`);
  }

  return new Response("Success", { status: 200 });
}
