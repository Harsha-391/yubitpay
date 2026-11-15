import { Flow } from "@/components/Flow";
import { Reveal } from "@/lib/motion/Reveal";
import { Playground } from "@/components/Playground";
import { Banner, SolutionsTrack, Statement } from "@/components/Scenes";
import { CtaBand, DeveloperExperience, Faq } from "@/components/Sections";
import { Story } from "@/components/Story";

// Each scene has its own way in (see Flow.tsx): cover → tape → growing frame → zooming board → horizontal track → letters → tilt + rising wordmark.
export default function Home() {
  return (
    <main>
      <Story />
      <Statement />
      <Banner />
      <DeveloperExperience />
      <Playground />
      <SolutionsTrack />
      <Faq />
      <CtaBand />
      <Reveal />
      <Flow />
    </main>
  );
}
