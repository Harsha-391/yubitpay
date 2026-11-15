import type { Metadata } from "next";
import { ProductPage } from "@/components/inner/ProductPage";
import { PAYOUTS } from "@/lib/products";

export const metadata: Metadata = { title: `${PAYOUTS.title} — Yubit Pay` };

export default function Page() {
  return <ProductPage p={PAYOUTS} />;
}
