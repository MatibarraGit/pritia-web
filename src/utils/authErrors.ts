import { authClient } from "@/libs/auth-client";

type ErrorTypes = Partial<
	Record<keyof typeof authClient.$ERROR_CODES, { es: string }>
>;

type BetterAuthError = {
	code?: string;
	type?: string;
	name?: string;
	message?: string;
	error?: BetterAuthError;
	[key: string]: unknown;
};

/**
 * Mapeo oficial de códigos de error de Better Auth a mensajes en español.
 * Se limita exclusivamente a los códigos expuestos por `authClient.$ERROR_CODES`.
 */
const errorCodes = {
	ACCOUNT_NOT_FOUND: { es: "Cuenta no encontrada." },
	CREDENTIAL_ACCOUNT_NOT_FOUND: {
		es: "No encontramos una cuenta de credenciales.",
	},
	EMAIL_CAN_NOT_BE_UPDATED: {
		es: "No es posible actualizar el correo electrónico.",
	},
	EMAIL_NOT_VERIFIED: { es: "El correo electrónico no está verificado." },
	FAILED_TO_CREATE_SESSION: { es: "No se pudo crear la sesión." },
	FAILED_TO_CREATE_USER: { es: "No se pudo crear el usuario." },
	FAILED_TO_GET_SESSION: { es: "No se pudo obtener la sesión." },
	FAILED_TO_GET_USER_INFO: {
		es: "No se pudo obtener la información del usuario.",
	},
	FAILED_TO_UNLINK_LAST_ACCOUNT: {
		es: "No se puede desvincular la última cuenta.",
	},
	FAILED_TO_UPDATE_USER: { es: "No se pudo actualizar el usuario." },
	ID_TOKEN_NOT_SUPPORTED: {
		es: "El proveedor no soporta tokens de identificación.",
	},
	INVALID_EMAIL: { es: "El correo electrónico no es válido." },
	INVALID_EMAIL_OR_PASSWORD: { es: "Correo o contraseña incorrectos." },
	INVALID_PASSWORD: { es: "La contraseña no es válida." },
	INVALID_TOKEN: { es: "El token es inválido o expiró." },
	PASSWORD_TOO_LONG: { es: "La contraseña es demasiado larga." },
	PASSWORD_TOO_SHORT: { es: "La contraseña es demasiado corta." },
	PROVIDER_NOT_FOUND: { es: "Proveedor de autenticación no encontrado." },
	SESSION_EXPIRED: { es: "La sesión ha expirado." },
	USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: {
		es: "Este correo ya está registrado.",
	},
	USER_EMAIL_NOT_FOUND: {
		es: "No se encontró un correo electrónico asociado.",
	},
	USER_NOT_FOUND: { es: "Usuario no encontrado." },
} satisfies ErrorTypes;

const DEFAULT_ERROR_MESSAGE =
	"Ocurrió un error inesperado. Inténtalo nuevamente.";

export function getErrorMessage(error: unknown): string {
	console.log(error);
	const parsedError = error as BetterAuthError;
	const code =
		parsedError.code ??
		parsedError.type ??
		parsedError.name ??
		(parsedError.error as BetterAuthError | undefined)?.code ??
		(parsedError.error as BetterAuthError | undefined)?.type ??
		(parsedError.error as BetterAuthError | undefined)?.name;

	if (code && code in errorCodes) {
		return errorCodes[code as keyof typeof errorCodes]?.es ?? DEFAULT_ERROR_MESSAGE;
	}

	const message =
		typeof parsedError.message === "string" ? parsedError.message : undefined;

	if (parsedError.message === "Too many requests. Please try again later." && parsedError.status === 429) {
		return "Demasiados intentos. Inténtalo más tarde.";
	}

	return message ?? DEFAULT_ERROR_MESSAGE;
}