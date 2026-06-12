import { NextResponse } from "next/server";

import { fetchIssuersIds } from "@/services";
import { ONE_DAY } from "@/utils/constants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentMethodId = searchParams.get("paymentMethodId")?.trim();

  if (!paymentMethodId) {
    return NextResponse.json(
      { message: "El medio de pago es obligatorio." },
      { status: 400 },
    );
  }

  const issuers = await fetchIssuersIds(paymentMethodId);

  return NextResponse.json(
    { issuers },
    {
      headers: {
        "Cache-Control": `public, s-maxage=${ONE_DAY}, stale-while-revalidate=${ONE_DAY}`,
      },
    },
  );
}