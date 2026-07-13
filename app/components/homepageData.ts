export type NavLink = {
  label: string;
  href: string;
};

export type CityLink = {
  label: string;
  href: string;
};

export type ArticleCard = {
  id: string;
  category: string;
  title: string;
  author: string;
  imageSeed: string;
};

export type FounderCard = {
  id: string;
  name: string;
  startup: string;
  pitch: string;
  imageSeed: string;
  streak: string;
  strikeRate: string;
};

export type MagazineCard = {
  id: string;
  category: string;
  title: string;
  author: string;
  imageSeed: string;
  edition: string;
  month: string;
  year: string;
  description: string;
};

export type HeroInsight = {
  id: string;
  label: string;
  title: string;
  copy: string;
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Chronicles", href: "/chronicles" },
  { label: "Founders", href: "/founders" },
  { label: "Magazines", href: "/magazines" },
  { label: "Research", href: "/research" },
  { label: "Investors", href: "/investors" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "College Collabs", href: "/college-collabs" },
  { label: "Submit Story", href: "/submit-story" },
  { label: "About Us", href: "/about" },
];

export const cityLinks: CityLink[] = [
  { label: "Bengaluru", href: "#" },
  { label: "Mumbai", href: "#" },
  { label: "Delhi", href: "#" },
  { label: "Hyderabad", href: "#" },
];

export const tickerItems = [
  "Zyra Bio closes a $14M seed round to scale climate-first materials for advanced manufacturing.",
  "Founders in Bengaluru launch a cross-border fintech rail for emerging market exporters.",
  "ARK Research briefs investors on AI-native industrial software and deep-tech resilience.",
  "Mumbai mobility startup reports 3x retention growth after rolling out community-led fleet financing.",
  "Delhi health-tech collective opens applications for its women-led diagnostics accelerator cohort.",
];

export const heroContent = {
  tag: "FEATURED CHRONICLE",
  title: "Inside India's new founder playbook: conviction, capital discipline, and compounding trust.",
  description:
    "A daily front page for founders, builders, and believers shaping the next wave of resilient companies.",
  imageSeed: "ark-hero",
};

export const heroInsights: HeroInsight[] = [
  {
    id: "daily-brief",
    label: "Daily Brief",
    title: "Morning signal for operators",
    copy: "Five sharp takeaways on capital, hiring, product velocity, and market movement.",
  },
  {
    id: "founder-desk",
    label: "Founder Desk",
    title: "Who is building with momentum",
    copy: "A rolling index of leaders with strong streaks, repeatable execution, and breakout indicators.",
  },
  {
    id: "investor-watch",
    label: "Investor Watch",
    title: "Where conviction is flowing",
    copy: "Spotlights on funds, angels, and themes shaping the next wave of opportunity.",
  },
];

export const featuredChronicles: ArticleCard[] = [
  {
    id: "chronicle-1",
    category: "Founder Story",
    title: "The second-time founder advantage is not speed. It is sharper decision quality.",
    author: "Naina Kapoor",
    imageSeed: "ark-chronicle-1",
  },
  {
    id: "chronicle-2",
    category: "Scaling",
    title: "What early teams get wrong about operating cadence when growth finally arrives.",
    author: "Rahul Menon",
    imageSeed: "ark-chronicle-2",
  },
  {
    id: "chronicle-3",
    category: "Capital",
    title: "Beyond vanity rounds: how disciplined capital storytelling changes the investor room.",
    author: "Saira Anand",
    imageSeed: "ark-chronicle-3",
  },
  {
    id: "chronicle-4",
    category: "Product",
    title: "Designing product rituals that turn user feedback into compounding insight.",
    author: "Dev Khurana",
    imageSeed: "ark-chronicle-4",
  },
  {
    id: "chronicle-5",
    category: "Markets",
    title: "New India, new demand curves: mapping breakout sectors before consensus catches up.",
    author: "Mira Shah",
    imageSeed: "ark-chronicle-5",
  },
];

export const featuredFounders: FounderCard[] = [
  {
    id: "founder-1",
    name: "Aarav Bedi",
    startup: "PulseForge AI",
    pitch: "Building lightweight AI copilots for industrial operations teams across Asia.",
    imageSeed: "ark-founder-1",
    streak: "18 day streak",
    strikeRate: "92% strike rate",
  },
  {
    id: "founder-2",
    name: "Ishita Rao",
    startup: "Kindred Health",
    pitch: "Reimagining preventive care workflows for women-led primary care clinics.",
    imageSeed: "ark-founder-2",
    streak: "11 day streak",
    strikeRate: "89% strike rate",
  },
  {
    id: "founder-3",
    name: "Kabir Sethi",
    startup: "LedgerMint",
    pitch: "Turning compliance-heavy export finance into a founder-friendly operating system.",
    imageSeed: "ark-founder-3",
    streak: "24 day streak",
    strikeRate: "95% strike rate",
  },
  {
    id: "founder-4",
    name: "Rhea Thomas",
    startup: "Northstar Mobility",
    pitch: "Helping EV fleet operators deploy faster with community-backed financing tools.",
    imageSeed: "ark-founder-4",
    streak: "9 day streak",
    strikeRate: "86% strike rate",
  },
];

export const investorSpotlights: ArticleCard[] = [
  {
    id: "investor-1",
    category: "VC Insight",
    title: "Why specialist capital is winning in sectors that need patient conviction.",
    author: "Aditya Vora",
    imageSeed: "ark-investor-1",
  },
  {
    id: "investor-2",
    category: "Angel Watch",
    title: "Operator-angels are changing how founders think about first-check value.",
    author: "Ritu Sharma",
    imageSeed: "ark-investor-2",
  },
  {
    id: "investor-3",
    category: "Markets",
    title: "Signals from new fund launches reveal a stronger appetite for industrial software.",
    author: "Sameer Bhat",
    imageSeed: "ark-investor-3",
  },
  {
    id: "investor-4",
    category: "Thesis",
    title: "The trust premium: sectors where founder credibility is now the core moat.",
    author: "Leena Prakash",
    imageSeed: "ark-investor-4",
  },
];

export const opportunities: ArticleCard[] = [
  {
    id: "opportunity-1",
    category: "Open Role",
    title: "Chief of Staff opportunity at a fast-growing climate hardware startup in Bengaluru.",
    author: "ARK Talent Desk",
    imageSeed: "ark-opportunity-1",
  },
  {
    id: "opportunity-2",
    category: "Grant",
    title: "Apply for a deep-tech commercialization grant focused on industrial robotics teams.",
    author: "Mitali Roy",
    imageSeed: "ark-opportunity-2",
  },
  {
    id: "opportunity-3",
    category: "Accelerator",
    title: "Growth-stage consumer founders can now join a capital strategy sprint this July.",
    author: "ARK Opportunities",
    imageSeed: "ark-opportunity-3",
  },
  {
    id: "opportunity-4",
    category: "Community",
    title: "Founder roundtables open in Mumbai for operators building profitable niche software.",
    author: "Community Team",
    imageSeed: "ark-opportunity-4",
  },
];

export const researchPapers: ArticleCard[] = [
  {
    id: "research-1",
    category: "Research",
    title: "Reading founder resilience through execution patterns, not narrative polish.",
    author: "ARK Research Lab",
    imageSeed: "ark-research-1",
  },
  {
    id: "research-2",
    category: "Data",
    title: "The new geography of startup density across India's emerging innovation corridors.",
    author: "Pranav Desai",
    imageSeed: "ark-research-2",
  },
  {
    id: "research-3",
    category: "Whitepaper",
    title: "Capital efficiency benchmarks for AI-native startups after the infrastructure reset.",
    author: "ARK Research Lab",
    imageSeed: "ark-research-3",
  },
  {
    id: "research-4",
    category: "Report",
    title: "Trust, talent, and time-to-value: what keeps enterprise buyers leaning in.",
    author: "Sonia Mehta",
    imageSeed: "ark-research-4",
  },
];

export const magazines: MagazineCard[] = [
  {
    id: "mag-1",
    category: "Startup",
    title: "The Founder's Playbook",
    author: "ARK Editorial Team",
    imageSeed: "ark-mag-1",
    edition: "Edition 1",
    month: "January",
    year: "2024",
    description: "Essential strategies for first-time founders navigating India's startup ecosystem.",
  },
  {
    id: "mag-2",
    category: "Tech",
    title: "AI Revolution",
    author: "ARK Editorial Team",
    imageSeed: "ark-mag-2",
    edition: "Edition 2",
    month: "February",
    year: "2024",
    description: "How artificial intelligence is transforming Indian industries and creating new opportunities.",
  },
  {
    id: "mag-3",
    category: "Research",
    title: "Climate Tech Frontier",
    author: "ARK Editorial Team",
    imageSeed: "ark-mag-3",
    edition: "Edition 3",
    month: "March",
    year: "2024",
    description: "Deep dive into climate technology startups and their impact on sustainable development.",
  },
  {
    id: "mag-4",
    category: "Tech",
    title: "Fintech Disruption",
    author: "ARK Editorial Team",
    imageSeed: "ark-mag-4",
    edition: "Edition 4",
    month: "April",
    year: "2024",
    description: "The future of financial technology in India's rapidly evolving digital landscape.",
  },
  {
    id: "mag-5",
    category: "Startup",
    title: "HealthTech Innovation",
    author: "ARK Editorial Team",
    imageSeed: "ark-mag-5",
    edition: "Edition 5",
    month: "May",
    year: "2024",
    description: "Revolutionary healthcare technologies changing patient care across India.",
  },
  {
    id: "mag-6",
    category: "Special Edition",
    title: "Special Edition: Women in Tech",
    author: "ARK Editorial Team",
    imageSeed: "ark-mag-6",
    edition: "Special",
    month: "June",
    year: "2024",
    description: "Celebrating women leaders who are shaping India's technology landscape.",
  },
];
