import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Sections";
import { SiteMotion } from "@/components/SiteMotion";

// Marketing pages: the nav above, the footer below. Login and sign-up live outside this group and have neither.
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
      {/* after the nav and footer it drives, so they have hydrated before it touches them */}
      <SiteMotion />
    </>
  );
}
