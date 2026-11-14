import { Flow } from "@/components/Flow";
import { Nav } from "@/components/Nav";
import { Playground } from "@/components/Playground";
import { Reveal } from "@/components/Reveal";
import { Banner, SolutionsTrack, Statement } from "@/components/Scenes";
import { Closing, DeveloperExperience, Faq } from "@/components/Sections";
import { Story } from "@/components/Story";

// Each scene has its own way in (see Flow.tsx): cover → tape → growing frame → zooming board → horizontal track → letters → tilt + rising wordmark.
export default function Home() {
  return (
    <main>
      <Nav />
      <Story />
      <Statement />
      <Banner />
      <DeveloperExperience />
      <Playground />
      <SolutionsTrack />
      <Faq />
      <Closing />
      <Reveal />
      <Flow />
    </main>
  );
}
