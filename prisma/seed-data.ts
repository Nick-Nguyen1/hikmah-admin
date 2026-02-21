/**
 * Pools of data for generating 100 startups and 100 investors.
 * pick(i, arr) returns a deterministic value so the same seed run is reproducible.
 */
function pick<T>(i: number, arr: T[]): T {
  return arr[i % arr.length]!;
}

function pickN<T>(i: number, arr: T[], n: number): T[] {
  const set = new Set<T>();
  for (let j = 0; set.size < n && j < arr.length * 2; j++) {
    set.add(pick(i + j, arr));
  }
  return Array.from(set);
}

export const LOCATIONS = [
  { city: "San Francisco, CA", lat: 37.7749, lng: -122.4194 },
  { city: "New York, NY", lat: 40.7128, lng: -74.006 },
  { city: "London, UK", lat: 51.5074, lng: -0.1278 },
  { city: "Berlin, Germany", lat: 52.52, lng: 13.405 },
  { city: "Paris, France", lat: 48.8566, lng: 2.3522 },
  { city: "Singapore", lat: 1.3521, lng: 103.8198 },
  { city: "Dubai, UAE", lat: 25.2048, lng: 55.2708 },
  { city: "Toronto, Canada", lat: 43.6532, lng: -79.3832 },
  { city: "Sydney, Australia", lat: -33.8688, lng: 151.2093 },
  { city: "Amsterdam, Netherlands", lat: 52.3676, lng: 4.9041 },
  { city: "Boston, MA", lat: 42.3601, lng: -71.0589 },
  { city: "Austin, TX", lat: 30.2672, lng: -97.7431 },
  { city: "Seattle, WA", lat: 47.6062, lng: -122.3321 },
  { city: "Los Angeles, CA", lat: 34.0522, lng: -118.2437 },
  { city: "Chicago, IL", lat: 41.8781, lng: -87.6298 },
  { city: "Miami, FL", lat: 25.7617, lng: -80.1918 },
  { city: "Kuala Lumpur, Malaysia", lat: 3.139, lng: 101.6869 },
  { city: "Istanbul, Turkey", lat: 41.0082, lng: 28.9784 },
  { city: "Cairo, Egypt", lat: 30.0444, lng: 31.2357 },
  { city: "Jakarta, Indonesia", lat: -6.2088, lng: 106.8456 },
  { city: "Mumbai, India", lat: 19.076, lng: 72.8777 },
  { city: "Tel Aviv, Israel", lat: 32.0853, lng: 34.7818 },
  { city: "Stockholm, Sweden", lat: 59.3293, lng: 18.0686 },
  { city: "Zurich, Switzerland", lat: 47.3769, lng: 8.5417 },
] as const;

export const SECTORS = [
  "SaaS",
  "Fintech",
  "Health",
  "AI",
  "Climate",
  "Developer Tools",
  "Energy",
  "EdTech",
  "Marketplace",
  "Logistics",
  "E-commerce",
  "Cybersecurity",
  "AgriTech",
  "PropTech",
  "InsurTech",
  "HR Tech",
  "Media",
  "Gaming",
  "Web3",
  "Hardware",
] as const;

export const STAGES = ["idea", "pre_seed", "seed", "series_a", "series_b"] as const;

export const STARTUP_ONE_LINERS = [
  "AI-powered workflow automation for teams",
  "Connecting patients with specialist care in minutes",
  "Carbon accounting and sustainability for SMEs",
  "B2B payments and invoicing for emerging markets",
  "No-code analytics for non-technical teams",
  "Smart logistics and last-mile delivery",
  "Shariah-compliant investment and savings app",
  "EdTech platform for upskilling and certifications",
  "Marketplace for halal consumer goods",
  "Cybersecurity for small and medium businesses",
  "PropTech for affordable housing discovery",
  "AgriTech supply chain and farmer financing",
  "InsurTech for parametric coverage",
  "HR and payroll for distributed teams",
  "Live commerce and social selling",
  "Developer tools for API observability",
  "Renewable energy aggregation for SMEs",
  "Mental health and wellness platform",
  "Legal tech for contract automation",
  "Recruiting and talent matching",
] as const;

export const INVESTOR_BIOS = [
  "Early-stage SaaS and dev tools. ex-FAANG operators.",
  "Healthcare and fintech at seed and Series A.",
  "Climate and sustainability focus. LP in several funds.",
  "B2B and enterprise software. Prefer technical founders.",
  "Fintech and payments in MENA and Southeast Asia.",
  "Shariah-compliant and impact-focused investments.",
  "Pre-seed and seed. First cheque and follow-on.",
  "Marketplaces and vertical SaaS. Operator background.",
  "Deep tech and AI. PhD founders welcome.",
  "EdTech and future of work. Global markets.",
  "Logistics and supply chain. Emerging markets.",
  "Consumer and D2C. Brand and community builders.",
  "Healthcare and biotech. Clinical and regulatory experience.",
  "PropTech and construction tech.",
  "Cybersecurity and infra. Enterprise buyers.",
  "AgriTech and food tech. Sustainability angle.",
  "Fintech and insurtech. Regulated markets.",
  "Gaming and interactive media.",
  "Hardware and IoT. Manufacturing experience.",
  "Web3 and tokenomics. Regulatory clarity focus.",
] as const;

const FIRST_NAMES = [
  "Alex", "Jordan", "Sam", "Morgan", "Riley", "Casey", "Avery", "Quinn",
  "Taylor", "Jamie", "Dakota", "Skyler", "Reese", "Parker", "Cameron",
  "Blake", "Finley", "Hayden", "Emerson", "River", "Sage", "Rowan",
  "Noor", "Omar", "Yusuf", "Hassan", "Amir", "Zara", "Layla", "Amina",
];

const LAST_NAMES = [
  "Founder", "Lee", "Chen", "Khan", "Ali", "Hassan", "Patel", "Singh",
  "Williams", "Brown", "Davis", "Wilson", "Martinez", "Anderson", "Thomas",
  "Green", "Clark", "Lewis", "Young", "Hall", "Adams", "Nelson",
];

export function getStartupSeed(i: number) {
  const loc = pick(i, LOCATIONS);
  const sectors = pickN(i, [...SECTORS], 1 + (i % 3));
  const stage = pick(i, STAGES);
  const funding = [null, 100, 250, 500, 750, 1000, 1500, 2000, 3000, 5000][i % 10] as number | null;
  const names = [
    "CloudFlow", "HealthBridge", "GreenLedger", "PayStream", "DataPulse", "LogicLabs",
    "NexusPay", "SkillForge", "HalalMart", "SecureStack", "HomeBase", "FarmChain",
    "Coverwise", "TalentHub", "LiveSell", "APIWatch", "SolarGrid", "MindSpace",
    "ContractIQ", "HireMatch", "CodeCraft", "EduPath", "TradeZone", "MedLink",
    "FinServe", "EcoTrack", "DevKit", "MarketPulse", "SupplyWise", "RetailOS",
  ];
  const oneLiners = [...STARTUP_ONE_LINERS];
  return {
    companyName: names[i % names.length]! + (i >= names.length ? ` ${(i % 50) + 1}` : ""),
    oneLiner: pick(i, oneLiners),
    sector: sectors,
    stage,
    fundingAmount: funding,
    location: loc.city,
    latitude: loc.lat,
    longitude: loc.lng,
    founderName: `${pick(i, FIRST_NAMES)} ${pick(i + 1, LAST_NAMES)}`,
  };
}

const FIRM_PREFIXES = [
  "Morgan", "Riley", "Green", "Blue", "Oak", "Cedar", "Summit", "Horizon",
  "Vertex", "Nexus", "Apex", "Pinnacle", "Catalyst", "Spark", "Lumina",
  "Atlas", "Orion", "Vega", "Stellar", "Pioneer", "Frontier", "Venture",
  "Capital", "Partners", "Ventures", "Fund", "Equity", "Growth", "First",
];

const FIRM_SUFFIXES = ["Ventures", "Partners", "Capital", "Fund", "Equity", "Growth", "Holdings"];

export function getInvestorSeed(i: number) {
  const loc = pick(i, LOCATIONS);
  const sectors = pickN(i, [...SECTORS], 2 + (i % 3));
  const stages = pickN(i, [...STAGES], 2 + (i % 3));
  const minChecks = [50, 100, 250, 500, 750, 1000];
  const maxChecks = [500, 1000, 2000, 5000, 10000, 15000];
  const a = minChecks[i % minChecks.length]!;
  const b = maxChecks[i % maxChecks.length]!;
  const firmName = `${pick(i, FIRM_PREFIXES)} ${pick(i, FIRM_SUFFIXES)}`;
  const bio = pick(i, INVESTOR_BIOS);
  return {
    firmName,
    bio,
    sectors,
    stages,
    minCheck: Math.min(a, b),
    maxCheck: Math.max(a, b),
    location: loc.city,
    latitude: loc.lat,
    longitude: loc.lng,
    name: `${pick(i + 2, FIRST_NAMES)} ${pick(i + 3, LAST_NAMES)}`,
  };
}
