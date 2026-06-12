import { getPaymentMethodLabel } from "@/mocks/paymentMockData";
import type {
  CreditInstallmentCatalog,
  CreditInstallmentQuote,
  CreditInstallmentSummaryItem,
  MercadoPagoInstallment,
  MercadoPagoPaymentMethod,
} from "@/types";
import { FINANCING_CONFIG, ONE_DAY } from "@/utils/constants";

// Configuración base de Mercado Pago y cuotas que se quieren destacar en la UI.
const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const MERCADO_PAGO_API_BASE_URL = "https://api.mercadopago.com";
const DEFAULT_CREDIT_PAYMENT_METHOD_ID = "master";

type FetchInstallmentsParams = {
  amount: number;
  paymentMethodId: string;
  issuerId?: string;
};

// ---------------------------------------------------------------------------
// Helpers de marcas y etiquetas
// ---------------------------------------------------------------------------

function getSyntheticPaymentMethod(paymentMethodId: string): MercadoPagoPaymentMethod {
  const localPaymentMethod = FINANCING_CONFIG.displayCardMethods.find(
    (method) => method.id === paymentMethodId,
  );

  if (localPaymentMethod) return localPaymentMethod;

  return {
    id: paymentMethodId,
    name: getPaymentMethodDisplayName(paymentMethodId),
    payment_type_id: "credit_card",
    status: "active",
  };
}

/**
 * Obtiene el nombre visible de la tarjeta.
 * Si Mercado Pago trae un nombre legible, se usa ese valor; si no, se cae al
 * label local del mock o a casos conocidos.
 */
// TODO: Lo necesito??
function getPaymentMethodDisplayName(paymentMethodId: string, fallback?: string) {

  if (fallback && fallback !== paymentMethodId) return fallback;

  return getPaymentMethodLabel(paymentMethodId);
}

/**
 * Extrae CFT y TEA desde labels de Mercado Pago.
 * Para Argentina, Mercado Pago suele devolver estos datos como labels:
 * "CFT_...|TEA_...".
 */
function extractTaxLabels(labels: string[]) {
  const taxLabel = labels.find((label) => label.includes("CFT_") || label.includes("TEA_"));

  if (!taxLabel) return {};

  const values = taxLabel.split("|").reduce<{ cft?: string; tea?: string }>((acc, item) => {
    if (item.startsWith("CFT_")) acc.cft = item.replace("CFT_", "");
    if (item.startsWith("TEA_")) acc.tea = item.replace("TEA_", "");
    return acc;
  }, {});

  return values;
}

// ---------------------------------------------------------------------------
// Construcción del catálogo normalizado
// ---------------------------------------------------------------------------

// Ordena cotizaciones por cantidad de cuotas
function sortQuotes(quotes: CreditInstallmentQuote[]) {
  return [...quotes].sort((a, b) => a.installments - b.installments)
}

// Elimina las cuotas repetidas
function dedupeQuotesByInstallments(quotes: CreditInstallmentQuote[]) {
  const quotesByInstallments = new Map<number, CreditInstallmentQuote>();

  for (const quote of quotes) {
    const currentQuote = quotesByInstallments.get(quote.installments);

    if (!currentQuote || quote.totalAmount < currentQuote.totalAmount) {
      quotesByInstallments.set(quote.installments, quote);
    }
  }

  return [...quotesByInstallments.values()];
}

/**
 * Arma el resumen del cartel de producto.
 * Para cada cantidad objetivo (1, 3, 6 y 12), elige la cotización con menor
 * total. Si no hay una opción disponible, deja esa cuota sin quote.
 */
// TODO: Elige la cotización con menor total? En el cartel del producto muestro como referencia las cuotas del BBVA
function buildSummary(quotes: CreditInstallmentQuote[]) {
  return FINANCING_CONFIG.featuredInstallments.map((installments) => {
    const quote = quotes
      .filter((item) => item.installments === installments)
      .sort((a, b) => a.totalAmount - b.totalAmount)[0];

    return { installments, quote };
  });
}

/**
 * Construye el objeto final que consumen el cartel y la modal.
 * Centraliza Medios de pago, cotizaciones ordenadas y resumen destacado.
 */
function buildCatalog({
  amount,
  paymentMethods,
  quotes,
}: {
  amount: number;
  paymentMethods: MercadoPagoPaymentMethod[];
  quotes: CreditInstallmentQuote[];
}): CreditInstallmentCatalog {
  const sortedQuotes = sortQuotes(quotes);

  return {
    amount,
    targetInstallments: FINANCING_CONFIG.featuredInstallments,
    paymentMethods,
    quotes: sortedQuotes
  };
}

// ---------------------------------------------------------------------------
// Normalización de respuestas reales y mock
// ---------------------------------------------------------------------------

/**
 * Convierte la respuesta cruda de Mercado Pago a `CreditInstallmentQuote`.
 * La app trabaja con nombres camelCase y datos enriquecidos como CFT/TEA,
 * nombre de tarjeta, banco emisor y fuente de datos.
 */
function normalizeMercadoPagoInstallments({
  installments,
  paymentMethod
}: {
  installments: MercadoPagoInstallment[];
  paymentMethod?: MercadoPagoPaymentMethod;
}) {
  return installments.flatMap((item) => {
    const paymentMethodId = item.payment_method_id || paymentMethod?.id || "";
    const paymentMethodName = getPaymentMethodDisplayName(paymentMethodId, paymentMethod?.name);
    const issuerId = item.issuer?.id != null ? String(item.issuer.id) : FINANCING_CONFIG.defaultIssuerId;
    const issuerName = item.issuer?.name || "Todos los bancos";
    // console.log("issuerName", issuerName)

    return item.payer_costs.map((payerCost) => {
      const labels = Array.isArray(payerCost.labels) ? payerCost.labels : [];
      const taxes = extractTaxLabels(labels);

      return {
        paymentMethodId,
        paymentMethodName,
        paymentMethodThumbnail: paymentMethod?.secure_thumbnail || paymentMethod?.thumbnail,
        issuerId,
        issuerName,
        issuerThumbnail: item.issuer?.secure_thumbnail,
        installments: payerCost.installments,
        installmentAmount: payerCost.installment_amount,
        totalAmount: payerCost.total_amount,
        recommendedMessage: payerCost.recommended_message,
        labels,
        cft: taxes.cft,
        tea: taxes.tea,
        installmentRate: payerCost.installment_rate,
        discountRate: payerCost.discount_rate,
      } satisfies CreditInstallmentQuote;
    });
  });
}

// ---------------------------------------------------------------------------
// Consultas a Mercado Pago
// ---------------------------------------------------------------------------

/**
 * Obtiene todos los medios de pago desde Mercado Pago y conserva solo tarjetas
 * de crédito activas. Se usa para saber qué marcas cotizar en el resumen.
 */
export async function fetchCreditPaymentMethods(): Promise<MercadoPagoPaymentMethod[]> {
  if (!MERCADO_PAGO_ACCESS_TOKEN) {
    console.error("Falta configurar token de acceso.");
    return [];
  }

  const startedAt = performance.now();
  try {
    const response = await fetch(`${MERCADO_PAGO_API_BASE_URL}/v1/payment_methods`, {
      next: { revalidate: ONE_DAY },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    });
    if (!response.ok) return [];

    const paymentMethods = (await response.json()) as MercadoPagoPaymentMethod[];
    console.log('Payment Methods', paymentMethods)

    // TODO: Eliminar después de despliegue
    console.log("[MP payment_methods] fetch resuelto en", Math.round(performance.now() - startedAt), "ms");
    return paymentMethods.filter(
      (method) => method.payment_type_id === "credit_card" && method.status === "active",
    );
  } catch (error) {
    console.error("Error al obtener medios de pago de Mercado Pago:", error);
    return [];
  }
}

/**
 * Cotiza cuotas para un monto y una tarjeta.
 * Si se envía `issuerId`, Mercado Pago filtra por banco emisor con
 * `issuer.id`; si no, devuelve las opciones disponibles para la tarjeta.
 */
export async function fetchInstallments({
  amount,
  paymentMethodId,
  issuerId,
}: FetchInstallmentsParams): Promise<MercadoPagoInstallment[]> {
  if (!MERCADO_PAGO_ACCESS_TOKEN) {
    console.error("Falta configurar token de acceso.");
    return [];
  }

  try {
    const url = new URL(`${MERCADO_PAGO_API_BASE_URL}/v1/payment_methods/installments`);

    url.searchParams.set("amount", String(amount));
    url.searchParams.set("payment_method_id", paymentMethodId);
    url.searchParams.set("issuer.id", issuerId ?? FINANCING_CONFIG.defaultIssuerId);

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    });
    const data = (await response.json()) as MercadoPagoInstallment[];

    if (!response.ok) return [];

    return data;
  } catch (error) {
    console.error("Error al obtener cuotas de Mercado Pago:", error);
    return [];
  }
}

export type CardIssuerOption = {
  id: string;
  name: string;
};

export async function fetchIssuersIds(paymentMethodId: string): Promise<CardIssuerOption[]> {
  if (!MERCADO_PAGO_ACCESS_TOKEN) {
    console.error("Falta configurar token de acceso.");
    return [];
  }

  try {
    const url = new URL(`${MERCADO_PAGO_API_BASE_URL}/v1/payment_methods/card_issuers`);
    url.searchParams.set("payment_method_id", paymentMethodId);

    const response = await fetch(url, {
      next: { revalidate: ONE_DAY },
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
      },
    });

    const data = (await response.json()) as Array<{
      id: string | number;
      name: string;
    }>;
    if (!response.ok) throw new Error((data as { message?: string }).message);

    const uniqueIssuers = new Map<string, CardIssuerOption>();

    for (const issuer of data) {
      const id = String(issuer.id);
    
      if (!uniqueIssuers.has(id)) {
        uniqueIssuers.set(id, {
          id,
          name: issuer.name,
        });
      }
    }

    return [...uniqueIssuers.values()].sort((a, b) =>
      a.name.localeCompare(b.name, "es")
    );

  } catch (error) {
    console.error("Error al obtener bancos aceptados por Mercado Pago:", error);
    return [];
  }
}

// ---------------------------------------------------------------------------
// APIs de dominio consumidas por componentes/routes
// ---------------------------------------------------------------------------

/**
 * Construye el catalogo inicial de financiacion para la pagina de producto.
 * Cotiza solo Mastercard y arma el resumen con las cuotas objetivo. Si Mercado
 * Pago falla, devuelve catalogo mock.
 */
// * Paso 1
export async function buildCreditInstallmentCatalogSummary(amount: number): Promise<CreditInstallmentSummaryItem[]> {
  const paymentMethod = FINANCING_CONFIG.displayCardMethods[0];
  const installments = await fetchInstallments({
    amount,
    paymentMethodId: DEFAULT_CREDIT_PAYMENT_METHOD_ID,
  });

  const quotes = normalizeMercadoPagoInstallments({
    installments,
    paymentMethod,
  });

  const sortedQuotes = sortQuotes(quotes);
  return buildSummary(sortedQuotes);
}

/**
 * Construye un catalogo para una seleccion especifica de la modal.
 * Se usa desde `/api/mercado-pago/installments` cuando el usuario elige
 * tarjeta y banco en la modal.
 */
export async function buildCreditInstallmentCatalogForSelection({
  amount,
  paymentMethodId,
  issuerId,
}: FetchInstallmentsParams): Promise<CreditInstallmentCatalog> {
  const paymentMethod = getSyntheticPaymentMethod(paymentMethodId);

  const installments = await fetchInstallments({
    amount,
    paymentMethodId: paymentMethod.id,
    issuerId,
  });

  const quotes = dedupeQuotesByInstallments(
    normalizeMercadoPagoInstallments({
      installments,
      paymentMethod,
    }),
  );

  return buildCatalog({
    amount,
    paymentMethods: [paymentMethod],
    quotes,
  });
}

/**
 * Compatibilidad con el nombre previo usado por componentes antiguos.
 * Internamente delega en `fetchInstallments`.
 */
export async function fetchFinancingByPriceAndCard({
  price,
  card,
}: {
  price: number;
  card: string;
}): Promise<MercadoPagoInstallment[]> {
  return fetchInstallments({
    amount: price,
    paymentMethodId: card,
  });
}
