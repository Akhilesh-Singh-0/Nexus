import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/client/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const alice = await prisma.user.upsert({
    where: { clerkId: "seed_alice" },
    update: {},
    create: { clerkId: "seed_alice", email: "alice@example.com", name: "Alice" },
  });

  const bob = await prisma.user.upsert({
    where: { clerkId: "seed_bob" },
    update: {},
    create: { clerkId: "seed_bob", email: "bob@example.com", name: "Bob" },
  });

  const conversation = await prisma.conversation.upsert({
    where: { id: "seed_conversation_alice_bob" },
    update: {},
    create: { id: "seed_conversation_alice_bob", isGroup: false },
  });

  await prisma.conversationParticipant.upsert({
    where: { userId_conversationId: { userId: alice.id, conversationId: conversation.id } },
    update: {},
    create: { userId: alice.id, conversationId: conversation.id, role: "member" },
  });

  await prisma.conversationParticipant.upsert({
    where: { userId_conversationId: { userId: bob.id, conversationId: conversation.id } },
    update: {},
    create: { userId: bob.id, conversationId: conversation.id, role: "member" },
  });

  console.log("Seeded:", { alice: alice.id, bob: bob.id, conversation: conversation.id });
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
