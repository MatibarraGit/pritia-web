import { NextResponse } from "next/server";

import { buildCreditInstallmentCatalogForSelection } from "@/services/mercado-pago";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amount = Number(searchParams.get("amount"));
  const paymentMethodId = searchParams.get("paymentMethodId")?.trim();
  const issuerId = searchParams.get("issuerId")?.trim() || undefined;

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      { message: "El monto debe ser un numero mayor a cero." },
      { status: 400 },
    );
  }

  if (!paymentMethodId) {
    return NextResponse.json(
      { message: "El medio de pago es obligatorio." },
      { status: 400 },
    );
  }

  if (!issuerId) {
    return NextResponse.json(
      { message: "El banco es obligatorio." },
      { status: 400 },
    );
  }

  const catalog = await buildCreditInstallmentCatalogForSelection({
    amount,
    paymentMethodId,
    issuerId,
  });

  return NextResponse.json(catalog, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
