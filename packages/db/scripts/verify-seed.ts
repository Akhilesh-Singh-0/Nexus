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
  const [users, conversations, participants, messages] = await Promise.all([
    prisma.user.count(),
    prisma.conversation.count(),
    prisma.conversationParticipant.count(),
    prisma.message.count(),
  ]);
  console.log({ users, conversations, participants, messages });
}

main().finally(async () => {
  await prisma.$disconnect();
});
