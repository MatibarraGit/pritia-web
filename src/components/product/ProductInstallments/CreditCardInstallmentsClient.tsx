"use client";

import Image from "next/image";
import { CreditCard } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui";
import { CreditOptionsModal } from "./CreditOptionsModal";
import type { CreditInstallmentSummaryItem } from "@/types";
import { formatPrice, FINANCING_CONFIG, getInstallmentAmount, getInstallmentLabel } from "@/utils";
import { ProductPricing } from "../ProductPricing";


const cardIconByMethod: Record<string, string> = {
  amex: "/icons/amex.svg",
  master: "/icons/mastercard.svg",
  naranja: "/icons/naranjax.svg",
  visa: "/icons/visa.svg",
};

type CreditCardInstallmentsClientProps = {
  catalog: CreditInstallmentSummaryItem[];
  price: number;
  discountPercent: number;
  originalPrice?: number;
};

function getSummaryQuote(catalog: CreditInstallmentSummaryItem[], installments: number) {
  return catalog.find((item) => item.installments === installments)?.quote;
}

export function CreditCardInstallmentsClient({ 
  catalog, 
  price,
  discountPercent,
  originalPrice
}: CreditCardInstallmentsClientProps) {
  const [open, setOpen] = useState(false);
  const listPrice = price * FINANCING_CONFIG.listPriceInterest;
  const installmentRows = FINANCING_CONFIG.featuredInstallments.map((installments) => ({
    installments,
    quote: getSummaryQuote(catalog, installments),
  }));

  return (
    <>
      <section className="">
        <ProductPricing price={price} discountPercent={discountPercent} originalPrice={originalPrice} />

        <div className="mt-5 border-l-4 border-gray-300 pl-4">
          <p className="text-base font-subheading text-gray-500">Precio de lista:</p>
          <p className="mt-1 text-3xl font-subheading leading-tight text-gray-950">
            {formatPrice(listPrice)}
          </p>

          <p className="mt-5 text-lg font-subheading leading-snug text-gray-950">
            Llevalo en hasta <span className="font-extrabold">12 cuotas al mejor precio</span>
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {FINANCING_CONFIG.displayCardMethods.map((paymentMethod) => (
              <Image
                key={paymentMethod.id}
                src={paymentMethod.icon}
                alt=""
                width={72}
                height={36}
                className="h-8 w-16 object-contain"
                aria-hidden="true"
              />
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {installmentRows.map(({ installments, quote }) => (
              <div
                key={installments}
                className="flex w-full max-w-xl flex-wrap items-baseline gap-x-1 gap-y-1 bg-gray-100 px-3 py-2 text-base leading-tight text-gray-950"
              >
                <span>{getInstallmentLabel(installments, listPrice, quote)}</span>
                {quote && (
                  <span className="font-extrabold">{formatPrice(getInstallmentAmount(installments, quote.installmentAmount, listPrice))}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-4 w-full rounded-full border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-100"
          onClick={() => setOpen(true)}
        >
          Conocé las cuotas con tu tarjeta
        </Button>
      </section>

      {open && (
        <CreditOptionsModal
          open={open}
          listPrice={listPrice}
          onOpenChange={setOpen}
        />
      )}
    </>
  );
}
