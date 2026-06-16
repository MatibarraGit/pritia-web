import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth, type Session } from "./auth";
import { userIsAdmin } from "./auth-roles";

type AuthGuardResult =
  | {
      success: true;
      session: Session;
    }
  | {
      success: false;
      response: NextResponse;
    };

export async function requireAuthenticatedSession(): Promise<AuthGuardResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session?.session) {
    return {
      success: false,
      response: NextResponse.json(
        { message: "No se ha podido autenticar el usuario" },
        { status: 401 }
      ),
    };
  }

  return {
    success: true,
    session,
  };
}

export async function requireAdminSession(): Promise<AuthGuardResult> {
  const authResult = await requireAuthenticatedSession();

  if (!authResult.success) {
    return authResult;
  }

  if (!userIsAdmin(authResult.session.user)) {
    return {
      success: false,
      response: NextResponse.json(
        { message: "No tenes permisos para realizar esta accion" },
        { status: 403 }
      ),
    };
  }

  return authResult;
}
