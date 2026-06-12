"use client";

/* eslint-disable @next/next/no-img-element */
import { Loader2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import type { CreditInstallmentCatalog } from "@/types";
import {
  formatPrice,
  getInstallmentAmount,
  getPaymentMethodOptions,
  getQuotesForSelection,
} from "@/utils";

type IssuerOption = {
  id: string;
  name: string;
};

type CreditOptionsModalProps = {
  open: boolean;
  listPrice: number;
  onOpenChange: (open: boolean) => void;
};

export function CreditOptionsModal({
  open,
  listPrice,
  onOpenChange,
}: CreditOptionsModalProps) {
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>();
  const [selectedIssuerId, setSelectedIssuerId] = useState<string>("");
  const [issuerOptions, setIssuerOptions] = useState<IssuerOption[]>([]);
  const [quotes, setQuotes] = useState<CreditInstallmentCatalog["quotes"]>([]);
  const [isLoadingIssuers, setIsLoadingIssuers] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const activeRequestRef = useRef(0);
  const issuersCacheRef = useRef<Map<string, IssuerOption[]>>(new Map());

  const paymentMethodOptions = useMemo(
    () => getPaymentMethodOptions(),
    [],
  );

  const hasCompleteSelection = Boolean(selectedPaymentMethodId && selectedIssuerId);

  const quoteSelection = async (paymentMethodId: string, issuerId: string) => {
    if (!paymentMethodId || !issuerId) return;

    const requestId = activeRequestRef.current + 1;
    activeRequestRef.current = requestId;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const params = new URLSearchParams({
        amount: String(listPrice),
        paymentMethodId,
      });

      params.set("issuerId", issuerId);

      const response = await fetch(`/api/mercado-pago/installments?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message || "No se pudo cotizar la financiacion.");
      }

      const data = (await response.json()) as CreditInstallmentCatalog;
      const nextQuotes = getQuotesForSelection(data.quotes, paymentMethodId, issuerId);

      if (activeRequestRef.current !== requestId) return;

      setQuotes(nextQuotes);
    } catch (error) {
      if (activeRequestRef.current !== requestId) return;

      setQuotes([]);
      setErrorMessage(error instanceof Error ? error.message : "No se pudo cotizar la financiacion.");
    } finally {
      if (activeRequestRef.current === requestId) {
        setIsLoading(false);
      }
    }
  };

  const loadIssuers = async (paymentMethodId: string) => {
    const requestId = activeRequestRef.current + 1;
    activeRequestRef.current = requestId;

    const cachedIssuers = issuersCacheRef.current.get(paymentMethodId);
    if (cachedIssuers) {
      setIssuerOptions(cachedIssuers);
      setIsLoadingIssuers(false);
      return;
    }

    setIsLoadingIssuers(true);
    setIssuerOptions([]);
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/mercado-pago/card-issuers?paymentMethodId=${encodeURIComponent(paymentMethodId)}`,
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message || "No se pudieron cargar los bancos.");
      }

      const data = (await response.json()) as { issuers: IssuerOption[] };
      const nextIssuers = data.issuers ?? [];

      if (activeRequestRef.current !== requestId) return;

      issuersCacheRef.current.set(paymentMethodId, nextIssuers);
      setIssuerOptions(nextIssuers);
    } catch (error) {
      if (activeRequestRef.current !== requestId) return;

      setIssuerOptions([]);
      setErrorMessage(error instanceof Error ? error.message : "No se pudieron cargar los bancos.");
    } finally {
      if (activeRequestRef.current === requestId) {
        setIsLoadingIssuers(false);
      }
    }
  };

  const handlePaymentMethodChange = (paymentMethodId: string) => {
    activeRequestRef.current += 1;

    setSelectedPaymentMethodId(paymentMethodId);
    setSelectedIssuerId("");
    setIssuerOptions([]);
    setQuotes([]);
    setIsLoading(false);
    setErrorMessage("");

    void loadIssuers(paymentMethodId);
  };

  const handleIssuerChange = (issuerId: string) => {
    if (!selectedPaymentMethodId) return;

    setSelectedIssuerId(issuerId);
    setQuotes([]);
    setErrorMessage("");
    void quoteSelection(selectedPaymentMethodId, issuerId);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      activeRequestRef.current += 1;
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-11/12 max-w-140! max-h-[85vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>Cuotas con tarjeta de credito</DialogTitle>
          <DialogDescription>
            <> - Fuente: Mercado Pago </>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <section className="space-y-2">
            <h3 className="text-sm font-subheading text-gray-900">
              Tarjetas de Credito
            </h3>

            {paymentMethodOptions.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {paymentMethodOptions.map((method) => {
                  const isSelected = selectedPaymentMethodId === method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={`Seleccionar ${method.name}`}
                      title={method.name}
                      className={`flex h-10 w-[70px] items-center justify-center border bg-white p-1.5 transition hover:border-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${
                        isSelected ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-200"
                      }`}
                      onClick={() => handlePaymentMethodChange(method.id)}
                    >
                      {method.icon ? (
                        <img
                          src={method.icon}
                          alt={method.name}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-xs font-subheading text-gray-700">{method.name}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-gray-500">Sin resultados</div>
            )}

            {selectedPaymentMethodId === "amex" && (
              <div className="py-2 px-4 mt-6 flex items-center gap-2 bg-primary/20 rounded-lg">
                <span className="h-8 px-4 flex items-center rounded-full bg-primary/40 color-primary font-subheading text-lg">!</span>
                <span>Las cuotas sin interés no están disponibles para tarjetas American Express</span>
              </div>
            )}
          </section>

          {selectedPaymentMethodId && (
            <section className="space-y-2">
              <label className="text-sm font-subheading text-gray-900">
                Banco
              </label>
              <Select
                value={selectedIssuerId}
                onValueChange={handleIssuerChange}
                disabled={isLoadingIssuers || issuerOptions.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      isLoadingIssuers
                        ? "Cargando bancos..."
                        : issuerOptions.length > 0 || selectedIssuerId === ""
                          ? "Seleccionar banco"
                          : "Sin bancos disponibles"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {issuerOptions.map((issuer) => (
                    <SelectItem className="py-2" key={issuer.id} value={issuer.id}>
                      • {issuer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>
          )}
        </div>

        {errorMessage && !hasCompleteSelection && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {hasCompleteSelection && (
          <>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              {isLoading && (
                <span className="inline-flex items-center gap-2 text-xs font-medium text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Cotizando seleccion
                </span>
              )}
            </div>

            {errorMessage && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cuotas</TableHead>
                  <TableHead>Valor cuota</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Interés</TableHead>
                  <TableHead>CFT</TableHead>
                  <TableHead>TEA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.length > 0 ? (
                  quotes.map((quote) => (
                    <TableRow
                      key={`${quote.paymentMethodId}-${quote.issuerId}-${quote.installments}-${quote.totalAmount}`}
                    >
                      <TableCell className="font-medium">
                        {quote.installments === 1 ? "1 cuota" : `${quote.installments} cuotas`}
                      </TableCell>
                      <TableCell className="font-subheading">{
                        selectedPaymentMethodId !== "amex" 
                          ? formatPrice(getInstallmentAmount(quote.installments, quote.installmentAmount, listPrice))
                          : formatPrice(quote.installmentAmount)
                        }
                      </TableCell>
                      <TableCell>
                        {formatPrice(quote.installments <= 3 && selectedPaymentMethodId !== "amex"
                          ? listPrice
                          : quote.totalAmount
                        )}
                      </TableCell>
                      <TableCell>{(quote.installments > 3 && quote.installmentRate && quote.installmentRate > 0) || (selectedPaymentMethodId === "amex" && quote.totalAmount > listPrice)
                        ? "c/interés"
                        : "s/interés"}
                      </TableCell>
                      <TableCell className="font-medium">{quote.cft
                        ? quote.installments <= 3 && selectedPaymentMethodId !== "amex"
                          ? `0,00%`
                          : quote.cft
                        : "No informado"}
                      </TableCell>
                      <TableCell>{quote.tea
                        ? quote.installments <= 3 && selectedPaymentMethodId !== "amex"
                          ? `0,00%`
                          : quote.tea
                        : "No informado"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-6 text-center text-sm text-gray-500">
                      {isLoading
                        ? "Cotizando cuotas para esta seleccion."
                        : "No hay cuotas disponibles para esta seleccion."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
