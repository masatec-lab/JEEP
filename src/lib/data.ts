import { prisma } from "./prisma";

export interface RouteData {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  priceNote: string;
  duration: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  difficultyLabel: string;
  maxPassengers: number;
  highlights: string[];
  included: string[];
  image: string;
  gallery: string[];
  startPoint: string;
  startPoints: { name: string; extraPrice: number }[];
  extraHourPrice: number;
  maxExtraHours: number;
  popular: boolean;
  photos?: { id: string; image: string; alt: string }[];
}

function parseRoute(raw: {
  highlights: string;
  startPoints: string;
  included: string;
  gallery: string;
  difficulty: number;
  [key: string]: unknown;
}): RouteData {
  return {
    ...raw,
    difficulty: raw.difficulty as 1 | 2 | 3 | 4 | 5,
    highlights: JSON.parse(raw.highlights || "[]"),
    included: JSON.parse(raw.included || "[]"),
    gallery: JSON.parse(raw.gallery || "[]"),
    startPoints: JSON.parse(raw.startPoints || "[]"),
  } as RouteData;
}

export async function getRoutes() {
  const raw = await prisma.route.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return raw.map(parseRoute);
}

export async function getPopularRoutes() {
  const raw = await prisma.route.findMany({
    where: { active: true, popular: true },
    orderBy: { order: "asc" },
  });
  return raw.map(parseRoute);
}

export async function getRouteBySlug(slug: string) {
  const raw = await prisma.route.findUnique({
    where: { slug },
    include: {
      photos: {
        where: { active: true },
        orderBy: { order: "asc" },
        select: { id: true, image: true, alt: true },
      },
    },
  });
  if (!raw || !raw.active) return null;
  const parsed = parseRoute(raw);
  parsed.photos = raw.photos;
  return parsed;
}

export async function getAllRouteSlugs() {
  const routes = await prisma.route.findMany({
    where: { active: true },
    select: { slug: true },
  });
  return routes.map((r) => r.slug);
}

export async function getReviews() {
  return prisma.review.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
}

export async function getFAQ() {
  return prisma.fAQ.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
}

export async function getGalleryItems() {
  return prisma.galleryItem.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
}

export async function getContacts() {
  const contacts = await prisma.contact.findMany();
  const map: Record<string, string> = {};
  contacts.forEach((c) => (map[c.key] = c.value));
  return map;
}

export async function getSettings() {
  const settings = await prisma.setting.findMany();
  const map: Record<string, string> = {};
  settings.forEach((s) => (map[s.key] = s.value));
  return map;
}

export async function getBlogPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
  });
}

export async function getAlbums() {
  return prisma.album.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: {
      photos: {
        where: { active: true },
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getAlbumBySlug(slug: string) {
  return prisma.album.findUnique({
    where: { slug },
    include: {
      photos: {
        where: { active: true },
        orderBy: { order: "asc" },
      },
    },
  });
}
