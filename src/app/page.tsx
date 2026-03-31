import Hero from "@/components/Hero";
import Advantages from "@/components/Advantages";
import PopularRoutes from "@/components/PopularRoutes";
import HowItWorks from "@/components/HowItWorks";
import Fleet from "@/components/Fleet";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import CTABlock from "@/components/CTABlock";
import {
  getPopularRoutes,
  getReviews,
  getFAQ,
  getGalleryItems,
  getContacts,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [popularRoutes, reviews, faqItems, galleryItems, contacts] =
    await Promise.all([
      getPopularRoutes(),
      getReviews(),
      getFAQ(),
      getGalleryItems(),
      getContacts(),
    ]);

  return (
    <main>
      <Hero contacts={contacts} />
      <Advantages />
      <PopularRoutes routes={popularRoutes} />
      <HowItWorks />
      <Fleet />
      <Gallery items={galleryItems} />
      <Reviews reviews={reviews} />
      <FAQ items={faqItems} />
      <CTABlock contacts={contacts} />
    </main>
  );
}
