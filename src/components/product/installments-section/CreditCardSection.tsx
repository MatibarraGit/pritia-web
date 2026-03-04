// /* eslint-disable @next/next/no-img-element */
// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui";
// // import { CreditOptionsModal } from "@/components";
// import { filterFinancingByBank } from "@/utils";
// import type { MercadoPagoInstallment } from "@/types";
// import { fetchFinancingByPriceAndCard } from "@/services/mercado-pago";

// const cardIconByMethod: Record<string, string> = {
//   visa: "/icons/visa.svg",
//   mastercard: "/icons/mastercard.svg",
//   amex: "/icons/amex.svg",
//   naranja_x: "/icons/naranjax.svg",
// };

// export const CreditCardSection = ({ price }: { price: number }) => {
//   const [open, setOpen] = useState(false);

// const [cardType, setCardType] = useState("visa")
// const [bank, setBank] = useState("Banco Nacion")
// const [financingData, setFinancingData] = useState<MercadoPagoInstallment[]>([])
// const [filteredData, setFilteredData] = useState<MercadoPagoInstallment>()

// // Obtener financiación desde la api según precio y tarjeta
// useEffect(() => {
//   async function loadData() {
//     const data: MercadoPagoInstallment[] = await fetchFinancingByPriceAndCard({ price, card: cardType }) 
//     setFinancingData(data)
//   }

//   loadData()
// }, [cardType, price])


// // Filtrar financiación por banco en el frontend
// // TODO: Resolver errores de tipos, hacer los nombres más declarativos, y filtrar cuotas por banco
// useEffect(() => {
//   const result: MercadoPagoInstallment = filterFinancingByBank(financingData, bank)
//   console.log(result)
//   setFilteredData(result)
// }, [bank, financingData])

//   return (
//     <>
//       {/* Sección de tarjetas de crédito */}
//       <div className="mt-4 rounded-lg bg-gray-200 px-4 py-5 space-y-4">
//         {/* {getFeaturedInstallmentPlans(price).map(({ plan }) => (
//           <div key={plan.installments} className="space-y-1">
//             <p className="text-sm text-gray-900">
//               {plan.installments} cuotas fijas de{" "}
//               <span className="font-bold">
//                 {formatPrice(plan.installment_amount)}
//               </span>
//             </p>
//             <div className="flex flex-wrap items-center gap-2">
//               {Object.entries(cardIconByMethod)
//                 .map(([id, src]) => (
//                   <div key={id} className="h-6 w-10 relative">
//                     <img src={src} alt={id} className="h-full w-full object-contain" />
//                   </div>
//                 ))}
//             </div>
//           </div>
//         ))} */}

//         <div className="pt-2">
//           <Button
//             type="button"
//             variant="outline"
//             className="w-full rounded-full bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm"
//             onClick={() => setOpen(true)}
//           >
//             Ver cuotas y medios de pagos
//           </Button>
//         </div>
//       </div>

//       {/* Modal con todos los medios de pago y planes */}
//       {/* <CreditOptionsModal open={open} onOpenChange={setOpen} price={price} /> */}
//     </>
//   );
// };
