import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { getStartupSeed, getInvestorSeed } from "./seed-data";

const prisma = new PrismaClient();

const PASSWORD = "password123"; // same for all seed users for easy login

async function main() {
  const passwordHash = await hash(PASSWORD, 10);

  // Create startup users + profiles
  const startup1 = await prisma.user.upsert({
    where: { email: "startup1@example.com" },
    update: {},
    create: {
      email: "startup1@example.com",
      passwordHash,
      name: "Alex Founder",
      role: "STARTUP",
      startupProfile: {
        create: {
          companyName: "CloudFlow",
          oneLiner: "AI-powered workflow automation for dev teams",
          description: "We help engineering teams ship faster with smart automation.",
          sector: ["SaaS", "Developer Tools"],
          stage: "seed",
          fundingAmount: 500,
          website: "https://cloudflow.example.com",
          location: "San Francisco, CA",
          latitude: 37.7749,
          longitude: -122.4194,
        },
      },
    },
    include: { startupProfile: true },
  });
  if (startup1.startupProfile) {
    await prisma.startupProfile.update({
      where: { id: startup1.startupProfile.id },
      data: { latitude: 37.7749, longitude: -122.4194 },
    });
  }

  const startup2 = await prisma.user.upsert({
    where: { email: "startup2@example.com" },
    update: {},
    create: {
      email: "startup2@example.com",
      passwordHash,
      name: "Jordan Lee",
      role: "STARTUP",
      startupProfile: {
        create: {
          companyName: "HealthBridge",
          oneLiner: "Connecting patients with specialist care in minutes",
          description: "Telehealth platform for specialist referrals.",
          sector: ["Health", "Fintech"],
          stage: "pre_seed",
          fundingAmount: 250,
          location: "New York, NY",
          latitude: 40.7128,
          longitude: -74.006,
        },
      },
    },
    include: { startupProfile: true },
  });
  if (startup2.startupProfile) {
    await prisma.startupProfile.update({
      where: { id: startup2.startupProfile.id },
      data: { latitude: 40.7128, longitude: -74.006 },
    });
  }

  const startup3 = await prisma.user.upsert({
    where: { email: "startup3@example.com" },
    update: {},
    create: {
      email: "startup3@example.com",
      passwordHash,
      name: "Sam Chen",
      role: "STARTUP",
      startupProfile: {
        create: {
          companyName: "GreenLedger",
          oneLiner: "Carbon accounting for SMEs",
          sector: ["Climate", "SaaS"],
          stage: "series_a",
          fundingAmount: 2000,
          website: "https://greenledger.example.com",
          location: "London, UK",
          latitude: 51.5074,
          longitude: -0.1278,
        },
      },
    },
    include: { startupProfile: true },
  });
  if (startup3.startupProfile) {
    await prisma.startupProfile.update({
      where: { id: startup3.startupProfile.id },
      data: { latitude: 51.5074, longitude: -0.1278 },
    });
  }

  // Create investor users + profiles
  const investor1 = await prisma.user.upsert({
    where: { email: "investor1@example.com" },
    update: {},
    create: {
      email: "investor1@example.com",
      passwordHash,
      name: "Morgan Capital",
      role: "INVESTOR",
      investorProfile: {
        create: {
          firmName: "Morgan Ventures",
          bio: "Early-stage SaaS and dev tools. ex-FAANG operators.",
          sectors: ["SaaS", "Developer Tools", "AI"],
          stages: ["pre_seed", "seed", "series_a"],
          minCheck: 100,
          maxCheck: 2000,
          location: "San Francisco, CA",
          latitude: 37.7749,
          longitude: -122.4194,
          website: "https://morganventures.example.com",
        },
      },
    },
    include: { investorProfile: true },
  });
  if (investor1.investorProfile) {
    await prisma.investorProfile.update({
      where: { id: investor1.investorProfile.id },
      data: { latitude: 37.7749, longitude: -122.4194 },
    });
  }

  const investor2 = await prisma.user.upsert({
    where: { email: "investor2@example.com" },
    update: {},
    create: {
      email: "investor2@example.com",
      passwordHash,
      name: "Riley Partners",
      role: "INVESTOR",
      investorProfile: {
        create: {
          firmName: "Riley Health Fund",
          bio: "Healthcare and fintech at seed and Series A.",
          sectors: ["Health", "Fintech"],
          stages: ["seed", "series_a"],
          minCheck: 250,
          maxCheck: 1500,
          location: "New York, NY",
          latitude: 40.7128,
          longitude: -74.006,
        },
      },
    },
    include: { investorProfile: true },
  });
  if (investor2.investorProfile) {
    await prisma.investorProfile.update({
      where: { id: investor2.investorProfile.id },
      data: { latitude: 40.7128, longitude: -74.006 },
    });
  }

  const investor3 = await prisma.user.upsert({
    where: { email: "investor3@example.com" },
    update: {},
    create: {
      email: "investor3@example.com",
      passwordHash,
      name: "Casey Green",
      role: "INVESTOR",
      investorProfile: {
        create: {
          firmName: "Green Horizon",
          bio: "Climate and sustainability focus.",
          sectors: ["Climate", "SaaS", "Energy"],
          stages: ["seed", "series_a", "series_b"],
          minCheck: 500,
          maxCheck: 5000,
          location: "London, UK",
          latitude: 51.5074,
          longitude: -0.1278,
        },
      },
    },
    include: { investorProfile: true },
  });
  if (investor3.investorProfile) {
    await prisma.investorProfile.update({
      where: { id: investor3.investorProfile.id },
      data: { latitude: 51.5074, longitude: -0.1278 },
    });
  }

  // Create 100 more startups (startup4@example.com .. startup103@example.com)
  for (let i = 4; i <= 103; i++) {
    const data = getStartupSeed(i);
    const user = await prisma.user.upsert({
      where: { email: `startup${i}@example.com` },
      update: {},
      create: {
        email: `startup${i}@example.com`,
        passwordHash,
        name: data.founderName,
        role: "STARTUP",
        startupProfile: {
          create: {
            companyName: data.companyName,
            oneLiner: data.oneLiner,
            sector: data.sector,
            stage: data.stage,
            fundingAmount: data.fundingAmount,
            location: data.location,
            latitude: data.latitude,
            longitude: data.longitude,
          },
        },
      },
      include: { startupProfile: true },
    });
    if (user.startupProfile) {
      await prisma.startupProfile.update({
        where: { id: user.startupProfile.id },
        data: { latitude: data.latitude, longitude: data.longitude },
      });
    }
  }

  // Create 100 more investors (investor4@example.com .. investor103@example.com)
  for (let i = 4; i <= 103; i++) {
    const data = getInvestorSeed(i);
    const user = await prisma.user.upsert({
      where: { email: `investor${i}@example.com` },
      update: {},
      create: {
        email: `investor${i}@example.com`,
        passwordHash,
        name: data.name,
        role: "INVESTOR",
        investorProfile: {
          create: {
            firmName: data.firmName,
            bio: data.bio,
            sectors: data.sectors,
            stages: data.stages,
            minCheck: data.minCheck,
            maxCheck: data.maxCheck,
            location: data.location,
            latitude: data.latitude,
            longitude: data.longitude,
          },
        },
      },
      include: { investorProfile: true },
    });
    if (user.investorProfile) {
      await prisma.investorProfile.update({
        where: { id: user.investorProfile.id },
        data: { latitude: data.latitude, longitude: data.longitude },
      });
    }
  }

  // Create a few match requests (startup1 → investor1, startup2 → investor2)
  if (startup1.startupProfile && investor1.investorProfile) {
    await prisma.matchRequest.upsert({
      where: {
        startupId_investorId: {
          startupId: startup1.startupProfile.id,
          investorId: investor1.investorProfile.id,
        },
      },
      update: {},
      create: {
        startupId: startup1.startupProfile.id,
        investorId: investor1.investorProfile.id,
        senderId: startup1.id,
        receiverId: investor1.id,
        message: "Would love to show you our traction and roadmap.",
        status: "PENDING",
      },
    });
  }
  if (startup2.startupProfile && investor2.investorProfile) {
    await prisma.matchRequest.upsert({
      where: {
        startupId_investorId: {
          startupId: startup2.startupProfile.id,
          investorId: investor2.investorProfile.id,
        },
      },
      update: {},
      create: {
        startupId: startup2.startupProfile.id,
        investorId: investor2.investorProfile.id,
        senderId: startup2.id,
        receiverId: investor2.id,
        status: "ACCEPTED",
      },
    });
  }

  // Admin user
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash,
      name: "Admin",
      role: "ADMIN",
      isAdmin: true,
    },
  });

  console.log("Seed complete.");
  console.log("Log in with any seed user using password:", PASSWORD);
  console.log("Startups: startup1@example.com .. startup103@example.com (103 total)");
  console.log("Investors: investor1@example.com .. investor103@example.com (103 total)");
  console.log("Admin: admin@example.com");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
