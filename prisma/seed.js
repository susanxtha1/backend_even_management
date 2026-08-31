import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userId = "ac82a03b-c4f1-4d09-9ba0-ac64c86cd517";

const venues = [
  {
    id: "e4a91b2c-8821-4f10-901a-123456789a01",
    name: "Grand Horizon Convention Center",
    address: "104 Market St, San Francisco, CA 94105",
    capacity: 1200,
    createdAt: "2026-08-01T09:48:16.000Z",
  },
  {
    id: "f5b02c3d-9932-4e21-a12b-234567890b02",
    name: "Apex Innovation Arena",
    address: "750 Tech Ave, Austin, TX 78701",
    capacity: 500,
    createdAt: "2026-08-06T09:48:16.000Z",
  },
  {
    id: "a6c13d4e-0043-4f32-b23c-345678901c03",
    name: "The Underground Music Hall",
    address: "432 Broadway, New York, NY 10013",
    capacity: 350,
    createdAt: "2026-08-11T09:48:16.000Z",
  },
];
const events = [
  {
    id: "b7d24e5f-1154-4a43-c34d-456789012d04",
    organizerId: "ac82a03b-c4f1-4d09-9ba0-ac64c86cd517",
    venueId: "e4a91b2c-8821-4f10-901a-123456789a01",
    title: "Global AI & Tech Summit 2026",
    description:
      "A premier single-day event exploring the future of generative AI, scalable cloud systems, and edge computing.",
    startTime: "2026-09-10T09:00:00.000Z",
    endTime: "2026-09-10T17:00:00.000Z",
    status: "published",
    createdAt: "2026-08-16T09:48:16.000Z",
  },
  {
    id: "c8e35f60-2265-4b54-d45e-567890123e05",
    organizerId: "ac82a03b-c4f1-4d09-9ba0-ac64c86cd517",
    venueId: "f5b02c3d-9932-4e21-a12b-234567890b02",
    title: "Developer Productive Workflows Workshop",
    description:
      "Hands-on interactive training session focused on mastering modern CI/CD pipelines and Prisma ORM performance.",
    startTime: "2026-09-25T10:00:00.000Z",
    endTime: "2026-09-25T14:00:00.000Z",
    status: "published",
    createdAt: "2026-08-21T09:48:16.000Z",
  },
  {
    id: "d9f46071-3376-4c65-e56f-678901234f06",
    organizerId: "ac82a03b-c4f1-4d09-9ba0-ac64c86cd517",
    venueId: "a6c13d4e-0043-4f32-b23c-345678901c03",
    title: "Indie Synthwave Night",
    description:
      "An evening featuring top local electronic producers and immersive audio-visual light shows.",
    startTime: "2026-08-26T20:00:00.000Z",
    endTime: "2026-08-27T02:00:00.000Z",
    status: "completed",
    createdAt: "2026-08-01T09:48:16.000Z",
  },
];

const main = async () => {
  console.log("Seeding database...");

  for (const venue of venues) {
    await prisma.venue.create({
      data: venue,
    });
    console.log(`Venue "${venue.name}" created.`);
  }

  for (const event of events) {
    await prisma.event.create({
      data: event,
    });
    console.log(`Event "${event.title}" created.`);
  }
  console.log("Database seeding completed.");
};
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
