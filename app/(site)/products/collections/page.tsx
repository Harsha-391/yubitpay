import type { Metadata } from "next";
import { ProductPage } from "@/components/inner/ProductPage";
import { COLLECTIONS } from "@/lib/products";

export const metadata: Metadata = { title: `${COLLECTIONS.title} — Yubit Pay` };

export default function Page() {
  return <ProductPage p={COLLECTIONS} />;
}
