import Image from "next/image";
import ProductsPage from "../productos/productsPage";
import HotSaleCountdown from "./HotSaleCountDown";
import { EVENTS } from "@/utils";

export async function generateMetadata() {
  return { 
    title: "Hot Sale 2026 | Pritia",
    description: ""

  };
}

export default function HotSalePageForMetadata() {
  return (
    <>
      <HotSaleCountdown />  
      <Image src="/img/banner-campaña-hotsale2.png" alt="Hot Sale" width={1600} height={500} className="w-11/12 max-w-content my-6 mx-auto rounded-lg object-cover" />
      <ProductsPage isHotSale={EVENTS.IS_HOT_SALE} />
    </>
  )
}

