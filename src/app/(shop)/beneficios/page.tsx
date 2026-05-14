import type { Metadata } from "next";
import BenefitsPage from "./benefitsPage";

export const metadata: Metadata = { title: "Beneficios"};

export default function CartPageForMetadata() {
  return <BenefitsPage />;
}