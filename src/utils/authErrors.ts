/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Mapeo de códigos de error de Better Auth a mensajes en español
 */
const ES_AUTH_ERRORS: Record<string, string> = {
	// Errores de autenticación
	INVALID_CREDENTIALS: "Usuario o contraseña incorrectos.",
	USER_NOT_FOUND: "No encontramos una cuenta con esos datos.",
	EMAIL_ALREADY_IN_USE: "Ese correo ya está registrado.",
	WEAK_PASSWORD: "La contraseña es demasiado débil.",
	TOKEN_EXPIRED: "Tu sesión ha caducado.",
	OAUTH_ACCOUNT_NOT_LINKED: "Esa cuenta ya está vinculada a otro usuario.",
	RATE_LIMITED: "Demasiados intentos. Inténtalo más tarde.",
	
	// Errores de validación
	INVALID_EMAIL: "El correo electrónico no es válido.",
	INVALID_PASSWORD: "La contraseña no cumple con los requisitos.",
	PASSWORDS_DO_NOT_MATCH: "Las contraseñas no coinciden.",
	MISSING_FIELDS: "Por favor completa todos los campos requeridos.",
  PASSWORD_TOO_SHORT: "La contraseña debe tener al menos 8 caracteres.",
	
	// Errores de OAuth
	OAUTH_ERROR: "Error al iniciar sesión con la red social.",
	OAUTH_ACCESS_DENIED: "Acceso denegado. Por favor intenta de nuevo.",
	
	// Errores del servidor
	SERVER_ERROR: "Error interno del servidor. Inténtalo más tarde.",
	NETWORK_ERROR: "Error de conexión. Verifica tu internet.",
  FAILED_TO_CREATE_USER: "Error al crear la cuenta. Inténtalo de nuevo.",
	
	// Error por defecto
	UNKNOWN: "Ha ocurrido un error. Inténtalo de nuevo.",
};

/**
 * Obtiene el mensaje de error en español basado en el código de error
 * @param error - El objeto de error que puede contener code, type, name o message
 * @returns El mensaje de error traducido al español
 */
export function getErrorMessage(error: unknown): string {
	// Intentar obtener el código de error de diferentes propiedades
  console.log(error)
	const code =
		(error as any)?.code ||
		(error as any)?.type ||
		(error as any)?.name ||
		(error as any)?.error?.code ||
		(error as any)?.error?.type ||
		(error as any)?.error?.name ||
		"UNKNOWN";

	// Si el código está en el mapeo, devolver el mensaje en español
	if (ES_AUTH_ERRORS[code]) {
		return ES_AUTH_ERRORS[code];
	}

	// Si no hay código pero hay un mensaje, intentar mapear por mensaje
	const message = (error as any)?.message || (error as any)?.error?.message || "";
	
	if (message) {
		// Mapear mensajes comunes en inglés a español
		const messageLower = message.toLowerCase();
		
		if (messageLower.includes("invalid credentials") || messageLower.includes("incorrect password")) {
			return ES_AUTH_ERRORS.INVALID_CREDENTIALS;
		}
		if (messageLower.includes("user not found") || messageLower.includes("email not found")) {
			return ES_AUTH_ERRORS.USER_NOT_FOUND;
		}
		if (messageLower.includes("email already") || messageLower.includes("already in use")) {
			return ES_AUTH_ERRORS.EMAIL_ALREADY_IN_USE;
		}
		if (messageLower.includes("weak password") || messageLower.includes("password too weak")) {
			return ES_AUTH_ERRORS.WEAK_PASSWORD;
		}
		if (messageLower.includes("token expired") || messageLower.includes("session expired")) {
			return ES_AUTH_ERRORS.TOKEN_EXPIRED;
		}
		if (messageLower.includes("rate limit") || messageLower.includes("too many attempts")) {
			return ES_AUTH_ERRORS.RATE_LIMITED;
		}
		if (messageLower.includes("invalid email")) {
			return ES_AUTH_ERRORS.INVALID_EMAIL;
		}
		if (messageLower.includes("network") || messageLower.includes("connection")) {
			return ES_AUTH_ERRORS.NETWORK_ERROR;
		}
	}

	// Si no se encuentra ningún mapeo, devolver el mensaje de error desconocido
	return ES_AUTH_ERRORS.UNKNOWN;
}

