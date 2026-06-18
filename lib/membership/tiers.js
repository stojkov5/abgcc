// Curated membership content (from the client's June 17 document).
// The page renders this static content; the "Join Now" button is matched to a
// real database tier (by title alias) so Stripe checkout uses the live tierId.

export const MEMBERSHIP_INTRO = `The American Balkan Global Chamber of Commerce (ABGCC) connects business leaders, investors, policymakers, entrepreneurs, professionals, and institutions across the United States, the Balkans, and global markets. Membership provides access to a dynamic network, strategic opportunities, and programming designed to foster meaningful connections, advance organizational objectives, and support long-term growth.

Whether you are an individual seeking professional development, a company looking to expand its reach, or an organization pursuing strategic partnerships, ABGCC offers a membership level designed to help you achieve your goals.`;

// Every benefit, with the info-icon description text.
export const BENEFITS = {
  globalNetwork: {
    label: "ABGCC Global Network",
    description:
      "Gain access to ABGCC's extensive network of business executives, investors, policymakers, entrepreneurs, academics, philanthropists, and industry experts across the United States, the Balkans, and global markets. Through curated introductions and strategic engagement opportunities, the Chamber helps members cultivate meaningful relationships and unlock new opportunities for growth and collaboration.",
  },
  directoryListing: {
    label: "Member Directory Listing",
    description:
      "Inclusion in the ABGCC Member Directory, providing visibility within the Chamber community and creating opportunities for networking, collaboration, and business development.",
  },
  accessEvents: {
    label: "Access to Events",
    description:
      "Invitations to ABGCC networking receptions, business forums, industry roundtables, panel discussions, cultural programs, and other events featuring executives, policymakers, investors, and influential stakeholders.",
  },
  priorityEvent: {
    label: "Priority Event Access",
    description:
      "Priority registration and reserved access for select ABGCC events, forums, and programs where attendance is limited.",
  },
  exclusiveEvents: {
    label: "Exclusive Events",
    description:
      "Invitations to private executive roundtables, leadership briefings, delegation receptions, and invitation-only gatherings with senior business and government leaders.",
  },
  annualPlanning: {
    label: "Annual Planning",
    description:
      "A dedicated annual planning discussion with the ABGCC team to identify objectives, priorities, and opportunities for engagement throughout the year.",
  },
  programPartnerships: {
    label: "Program Partnerships",
    description:
      "The opportunity to collaborate with ABGCC on events, initiatives, and programs that convene business leaders, investors, policymakers, and other stakeholders around important economic, commercial, and policy issues.",
  },
  strategicAdvisory: {
    label: "Strategic Advisory",
    description:
      "Ongoing engagement with ABGCC leadership to align member priorities with relevant Chamber initiatives, opportunities, and strategic objectives.",
  },
  brandVisibility: {
    label: "Brand Visibility",
    description:
      "Inclusion in the ABGCC Member Directory and opportunities for recognition across Chamber communications, events, digital platforms, and promotional materials, with visibility increasing by membership level.",
  },
  sponsorship: {
    label: "Sponsorship Opportunities",
    description:
      "Priority access to sponsorship opportunities that elevate brand visibility and position members alongside influential business and community leaders.",
  },
  delegationEngagement: {
    label: "Delegation Engagement",
    description:
      "Opportunities to participate in trade missions, host visiting business delegations, and engage directly with international executives, investors, and government representatives.",
  },
  speaking: {
    label: "Speaking Opportunities",
    description:
      "Opportunities to serve as a speaker, moderator, host, or featured participant at ABGCC programs and events.",
  },
  thoughtLeadership: {
    label: "Thought Leadership",
    description:
      "Opportunities to showcase expertise through keynote presentations, executive interviews, featured content, and participation in high-level discussions on emerging trends and critical issues.",
  },
  executiveSupport: {
    label: "Executive Support",
    description:
      "Access to a dedicated senior member of the ABGCC team who can provide strategic guidance, facilitate introductions, and help advance organizational objectives.",
  },
  strategySession: {
    label: "Annual Executive Strategy Session",
    description:
      "A dedicated annual strategy session with senior ABGCC leadership focused on organizational priorities, market opportunities, relationship-building objectives, and customized engagement opportunities.",
  },
  priorityDelegation: {
    label: "Priority Delegation Access",
    description:
      "Preferred access to executive-level delegation meetings, strategic introductions, trade missions, and select engagements involving business leaders, investors, and government representatives.",
  },
};

// Row order for the comparison table.
export const BENEFIT_ORDER = [
  "globalNetwork",
  "directoryListing",
  "accessEvents",
  "priorityEvent",
  "exclusiveEvents",
  "annualPlanning",
  "programPartnerships",
  "strategicAdvisory",
  "brandVisibility",
  "sponsorship",
  "delegationEngagement",
  "speaking",
  "thoughtLeadership",
  "executiveSupport",
  "strategySession",
  "priorityDelegation",
];

// Tier columns, low → high (matches the document's table).
export const TIER_COLUMNS = [
  "individual",
  "professional",
  "corporate",
  "patron",
  "presidential",
];

// Benefit availability per tier: true | false | "limited"
export const COMPARISON = {
  globalNetwork:        { individual: true,  professional: true,  corporate: true,      patron: true, presidential: true },
  directoryListing:     { individual: true,  professional: true,  corporate: true,      patron: true, presidential: true },
  accessEvents:         { individual: true,  professional: true,  corporate: true,      patron: true, presidential: true },
  priorityEvent:        { individual: false, professional: false, corporate: false,     patron: true, presidential: true },
  exclusiveEvents:      { individual: false, professional: false, corporate: false,     patron: true, presidential: true },
  annualPlanning:       { individual: false, professional: false, corporate: true,      patron: true, presidential: true },
  programPartnerships:  { individual: false, professional: false, corporate: true,      patron: true, presidential: true },
  strategicAdvisory:    { individual: false, professional: false, corporate: true,      patron: true, presidential: true },
  brandVisibility:      { individual: false, professional: true,  corporate: true,      patron: true, presidential: true },
  sponsorship:          { individual: false, professional: false, corporate: true,      patron: true, presidential: true },
  delegationEngagement: { individual: false, professional: false, corporate: true,      patron: true, presidential: true },
  speaking:             { individual: false, professional: false, corporate: true,      patron: true, presidential: true },
  thoughtLeadership:    { individual: false, professional: false, corporate: "limited", patron: true, presidential: true },
  executiveSupport:     { individual: false, professional: false, corporate: true,      patron: true, presidential: true },
  strategySession:      { individual: false, professional: false, corporate: false,     patron: false, presidential: true },
  priorityDelegation:   { individual: false, professional: false, corporate: false,     patron: false, presidential: true },
};

// Tiers, high → low (card display order).
export const TIERS = [
  {
    key: "presidential",
    title: "Presidential Circle",
    price: 50000,
    premier: true,
    aliases: ["presidential"],
    description:
      "ABGCC's highest level of membership, providing unparalleled access, visibility, strategic engagement, and leadership opportunities across our global network. Limited to a select group of strategic partners.",
  },
  {
    key: "patron",
    title: "Patron",
    price: 10000,
    aliases: ["patron"],
    description:
      "Designed for organizations seeking a highly engaged partnership with ABGCC and a prominent role in advancing business, investment, and policy discussions across the United States and the Balkans.",
  },
  {
    key: "corporate",
    title: "Corporate",
    price: 4500,
    aliases: ["corporate"],
    description:
      "For companies looking to expand their visibility, strengthen strategic relationships, and engage with business and policy leaders throughout the ABGCC network.",
  },
  {
    key: "professional",
    title: "Professional",
    price: 850,
    aliases: ["professional", "business"],
    description:
      "Designed for professionals looking to expand their network, stay informed on industry trends, and build relationships with business leaders and decision-makers across the ABGCC community.",
  },
  {
    key: "individual",
    title: "Individual",
    price: 250,
    aliases: ["individual"],
    description:
      "Designed for students, young professionals, entrepreneurs, artists, academics, and community members seeking to build meaningful connections and engage with the Chamber's business, cultural, and professional network.",
  },
];

// Benefits a given tier includes (derived from the comparison matrix).
export function tierBenefits(tierKey) {
  return BENEFIT_ORDER.filter((b) => COMPARISON[b]?.[tierKey]);
}
