import type { Metadata } from "next";
import { ProductPage } from "@/components/inner/ProductPage";
import { UPI } from "@/lib/products";

export const metadata: Metadata = { title: `${UPI.title} — Yubit Pay` };

export default function Page() {
  return <ProductPage p={UPI} />;
}
