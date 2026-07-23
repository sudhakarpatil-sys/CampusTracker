import { Hero } from "@/components/landing/hero";
import { ProductIntro } from "@/components/landing/product-intro";
import { Features } from "@/components/landing/features";
import { Benefits } from "@/components/landing/benefits";
import { FAQ } from "@/components/landing/faq";
import { Contact } from "@/components/landing/contact";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ProductIntro />
      <Features />
      <Benefits />
      <FAQ />
      <Contact />
    </>
  );
}
