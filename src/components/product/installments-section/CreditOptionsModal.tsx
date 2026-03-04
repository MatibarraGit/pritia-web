// "use client";

// import { useState, useMemo } from "react";

// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; 
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// import {
//   paymentMethods,
//   getUniquePaymentMethodIds,
//   getPaymentMethodLabel,
//   getIssuersByMethod,
//   scaleInstallments,
//   type InstallmentPlan,
// } from "@/mocks";
// import { getInstallmentPlans, formatPrice } from "@/utils";

// interface CreditOptionsModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   price: number;
// }

// export const CreditOptionsModal = ({ open, onOpenChange, price }: CreditOptionsModalProps) => {
//   const methodIds = getUniquePaymentMethodIds();
//   const [selectedMethod, setSelectedMethod] = useState(methodIds[0]);
//   const issuers = getIssuersByMethod(selectedMethod);
//   const [selectedIssuerId, setSelectedIssuerId] = useState(issuers[0]?.issuer.id || "");

//   const handleMethodChange = (val: string) => {
//     setSelectedMethod(val);
//     const newIssuers = getIssuersByMethod(val);
//     setSelectedIssuerId(newIssuers[0]?.issuer.id || "");
//   };

//   const currentData = useMemo<InstallmentPlan[]>(() => {
//     const match = paymentMethods.find(
//       (pm) => pm.payment_method_id === selectedMethod && pm.issuer.id === selectedIssuerId
//     );
//     if (!match) return [];
//     return scaleInstallments(match.installments, price);
//   }, [selectedMethod, selectedIssuerId, price]);

//   // Featured: mejores opciones para cada cantidad de cuotas
//   const featuredPlans = useMemo(() => {
//     return getInstallmentPlans(price);
//   }, [price]);

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Medios de pago y cuotas</DialogTitle>
//           <DialogDescription>Producto: {formatPrice(price)}</DialogDescription>
//         </DialogHeader>

//         <Tabs defaultValue="featured">
//           <TabsList className="w-full">
//             <TabsTrigger value="featured" className="flex-1">Destacados</TabsTrigger>
//             <TabsTrigger value="all" className="flex-1">Ver todos</TabsTrigger>
//           </TabsList>

//           <TabsContent value="featured">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Cuotas</TableHead>
//                   <TableHead>Valor cuota</TableHead>
//                   <TableHead>Total</TableHead>
//                   <TableHead>Tarjeta</TableHead>
//                   <TableHead>Banco</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {featuredPlans.map((item) => (
//                   <TableRow key={item.plan.installments}>
//                     <TableCell className="font-medium">{item.plan.installments} cuotas</TableCell>
//                     <TableCell className="font-bold">{formatPrice(item.plan.installment_amount)}</TableCell>
//                     <TableCell>{formatPrice(item.plan.total_amount)}</TableCell>
//                     <TableCell>{getPaymentMethodLabel(item.method)}</TableCell>
//                     <TableCell className="text-muted-foreground text-xs">{item.issuer}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TabsContent>

//           <TabsContent value="all" className="space-y-4">
//             <div className="flex gap-3">
//               <Select value={selectedMethod} onValueChange={handleMethodChange}>
//                 <SelectTrigger className="w-[180px]">
//                   <SelectValue placeholder="Medio de pago" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {methodIds.map((id) => (
//                     <SelectItem key={id} value={id}>{getPaymentMethodLabel(id)}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Select value={selectedIssuerId} onValueChange={setSelectedIssuerId}>
//                 <SelectTrigger className="w-[200px]">
//                   <SelectValue placeholder="Banco emisor" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {issuers.map((iss) => (
//                     <SelectItem key={iss.issuer.id} value={iss.issuer.id}>{iss.issuer.name}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Cuotas</TableHead>
//                   <TableHead>Valor cuota</TableHead>
//                   <TableHead>Total</TableHead>
//                   <TableHead>Interés</TableHead>
//                   <TableHead>CFT</TableHead>
//                   <TableHead>TEA</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {currentData.map((plan) => (
//                   <TableRow key={plan.installments}>
//                     <TableCell className="font-medium">{plan.installments} {plan.installments === 1 ? "pago" : "cuotas"}</TableCell>
//                     <TableCell className="font-bold">{formatPrice(plan.installment_amount)}</TableCell>
//                     <TableCell>{formatPrice(plan.total_amount)}</TableCell>
//                     <TableCell>{plan.interest_percentage.toFixed(2)}%</TableCell>
//                     <TableCell className="text-xs">{plan.cft}</TableCell>
//                     <TableCell className="text-xs">{plan.tea}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TabsContent>
//         </Tabs>
//       </DialogContent>
//     </Dialog>
//   );
// };