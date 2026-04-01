import JsonLd from "@/components/JsonLd";
import Hero from "@/components/Hero";
import Advantages from "@/components/Advantages";
import PopularRoutes from "@/components/PopularRoutes";
import HowItWorks from "@/components/HowItWorks";
import Fleet from "@/components/Fleet";
import AlbumGallery from "@/components/AlbumGallery";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import CTABlock from "@/components/CTABlock";
import {
  getPopularRoutes,
  getReviews,
  getFAQ,
  getAlbums,
  getContacts,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [popularRoutes, reviews, faqItems, albums, contacts] =
    await Promise.all([
      getPopularRoutes(),
      getReviews(),
      getFAQ(),
      getAlbums(),
      getContacts(),
    ]);

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: "Jeepping Travel Адыгея",
    description: "Джиппинг-туры по горам Адыгеи на УАЗах. 10 маршрутов для семей, компаний и любителей экстрима.",
    telephone: contacts.phone_raw || "+79991234567",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Каменномостский",
      addressRegion: "Республика Адыгея",
      addressCountry: "RU",
    },
    priceRange: "5000-22000 ₽",
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main>
      <JsonLd data={organizationLd} />
      <JsonLd data={faqLd} />
      <Hero contacts={contacts} />
      <Advantages />
      <PopularRoutes routes={popularRoutes} />
      <HowItWorks />
      <Fleet />
      <AlbumGallery albums={albums} />
      <Reviews reviews={reviews} />
      <FAQ items={faqItems} />
      <CTABlock contacts={contacts} />
    </main>
  );
}
