import type { BlogImageAsset, DashboardBlog } from "@/lib/dashboard-blogs/types";

/**
 * MOCK DATA — for UI visibility only.
 * When integrating: delete this file and wire real blog APIs instead.
 */
export const MOCK_BLOGS: DashboardBlog[] = [
  {
    id: "mock-blog-001",
    title: "Express Courier Tips for Same-Day Delivery",
    slug: "express-courier-tips",
    excerpt:
      "How businesses in NRW can plan reliable same-day courier routes without delays.",
    status: "PUBLISHED",
    seoTitle: "Same-Day Courier Tips | Take & Bring",
    seoDescription: "Practical tips for same-day courier deliveries across NRW.",
    category: "Courier Transport",
    dateLabel: "18 Jul 2026",
    bodyHtml:
      "<p>Same-day courier success starts with clear pickup windows and reliable handovers.</p><p>Plan buffer time for urban traffic and always confirm recipient availability.</p>",
    coverImageUrl: "/images/blog-hero.webp",
    viewsCount: 1284,
    createdAt: "2026-07-18T09:00:00.000Z",
    updatedAt: "2026-07-18T09:00:00.000Z",
  },
  {
    id: "mock-blog-002",
    title: "Cold Chain Basics for Refrigerated Transport",
    slug: "cold-chain-basics",
    excerpt:
      "A short guide to temperature control, monitoring, and documentation for chilled freight.",
    status: "DRAFT",
    seoTitle: "Cold Chain Basics",
    seoDescription: "Essentials of refrigerated transport for food and pharma.",
    category: "Refrigerated",
    dateLabel: "12 Jul 2026",
    bodyHtml:
      "<h2>Why temperature control matters</h2><p>Consistent cold-chain handling protects product quality from pickup to delivery.</p>",
    coverImageUrl: "/images/benefit-reliability.webp",
    viewsCount: 0,
    createdAt: "2026-07-12T11:20:00.000Z",
    updatedAt: "2026-07-12T11:20:00.000Z",
  },
  {
    id: "mock-blog-003",
    title: "International Shipping Checklist for SMEs",
    slug: "international-shipping-checklist",
    excerpt:
      "Documents, packaging, and lane planning tips for first-time exporters.",
    status: "PUBLISHED",
    seoTitle: "International Shipping Checklist",
    seoDescription: "Checklist for SME international freight shipments.",
    category: "International",
    dateLabel: "02 Jul 2026",
    bodyHtml:
      "<p>Before booking an international lane, confirm Incoterms, HS codes, and packaging standards.</p>",
    coverImageUrl: "/images/audience-business.webp",
    viewsCount: 892,
    createdAt: "2026-07-02T08:15:00.000Z",
    updatedAt: "2026-07-02T08:15:00.000Z",
  },
  {
    id: "mock-blog-004",
    title: "Warehouse Cross-Docking for Faster Turnaround",
    slug: "warehouse-cross-docking",
    excerpt:
      "Reduce storage time and speed up outbound tours with practical cross-dock habits.",
    status: "DRAFT",
    seoTitle: "Cross-Docking Guide",
    seoDescription: "How cross-docking improves logistics turnaround.",
    category: "Warehouse",
    dateLabel: "28 Jun 2026",
    bodyHtml:
      "<p>Cross-docking works best when inbound slots and outbound routes are synchronized.</p>",
    coverImageUrl: "/images/about-team.webp",
    viewsCount: 45,
    createdAt: "2026-06-28T16:40:00.000Z",
    updatedAt: "2026-06-28T16:40:00.000Z",
  },
];

export const MOCK_BLOG_IMAGES: BlogImageAsset[] = [
  {
    id: "img-001",
    publicUrl: "/images/blog-hero.webp",
    altText: "Logistics hero",
    createdAt: "2026-06-01T10:00:00.000Z",
  },
  {
    id: "img-002",
    publicUrl: "/images/benefit-reliability.webp",
    altText: "Reliability",
    createdAt: "2026-06-02T10:00:00.000Z",
  },
  {
    id: "img-003",
    publicUrl: "/images/audience-business.webp",
    altText: "Business audience",
    createdAt: "2026-06-03T10:00:00.000Z",
  },
  {
    id: "img-004",
    publicUrl: "/images/about-team.webp",
    altText: "Team",
    createdAt: "2026-06-04T10:00:00.000Z",
  },
  {
    id: "img-005",
    publicUrl: "/images/contact-hero.webp",
    altText: "Contact hero",
    createdAt: "2026-06-05T10:00:00.000Z",
  },
];
