import PublicLayout from "../components/layout/PublicLayout";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import CallToAction from "../components/home/CallToAction";

export default function Home() {
  return (
    <PublicLayout>
      <Hero />
      <Features />
      <CallToAction />
    </PublicLayout>
  );
}