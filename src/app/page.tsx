import Hero from "@/components/Hero";
import Advantages from "@/components/Advantages";
import PopularRoutes from "@/components/PopularRoutes";
import HowItWorks from "@/components/HowItWorks";
import Fleet from "@/components/Fleet";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";

export default function Home() {
  return (
    <main>
      <Hero />
      <Advantages />
      <PopularRoutes />
      <HowItWorks />
      <Fleet />
      <Gallery />
      <Reviews />
    </main>
  );
}
