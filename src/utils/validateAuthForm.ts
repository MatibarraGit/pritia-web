import type { AuthFormData } from "@/types";
export function validateAuthForm(
  register: boolean,
  form: AuthFormData
): AuthFormData | null {
  // Inicializar objeto de errores
  const errors: AuthFormData = {
    email: "",
    password: ""
  };

  // Validación del firstName (solo si es registro)
  if (register === true) {
    const firstName = form.firstName;

    if (!firstName) {
      errors.firstName = "El nombre es requerido";
    } else if (typeof firstName !== "string") {
      errors.firstName = "El nombre debe ser un texto";
    } else {
      const trimmedFirstName = firstName.trim();
      if (trimmedFirstName.length < 2) {
        errors.firstName = "El nombre debe tener al menos 2 caracteres";
      } else if (trimmedFirstName.length > 50) {
        errors.firstName = "El nombre no debe exceder los 50 caracteres";
      }
    }

    // Validación del lastName (solo si es registro)
    const lastName = form.lastName;

    if (!lastName) {
      errors.lastName = "El apellido es requerido";
    } else if (typeof lastName !== "string") {
      errors.lastName = "El apellido debe ser un texto";
    } else {
      const trimmedLastName = lastName.trim();
      if (trimmedLastName.length < 2) {
        errors.lastName = "El apellido debe tener al menos 2 caracteres";
      } else if (trimmedLastName.length > 50) {
        errors.lastName = "El apellido no debe exceder los 50 caracteres";
      }
    }
  }

  // Validación del email
  const email = form.email;

  if (!email) {
    errors.email = "El email es requerido";
  } else if (typeof email !== "string") {
    errors.email = "El email debe ser un texto";
  } else {
    const trimmedEmail = email.trim();
    if (trimmedEmail.length === 0) {
      errors.email = "El email no puede estar vacío";
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(trimmedEmail)) {
      errors.email = "El formato del email no es válido";
    }
  }

  // Validación del password
  const password = form.password;

  if (!password) {
    errors.password = "La contraseña es requerida";
  } else if (typeof password !== "string") {
    errors.password = "La contraseña debe ser un texto";
  } else {
    const trimmedPassword = password.trim();
    if (trimmedPassword.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (trimmedPassword.length > 30) {
      errors.password = "La contraseña no debe exceder los 30 caracteres";
    } else {
      if (!/[A-Z]/.test(password)) {
        errors.password =
          "La contraseña debe contener al menos una letra mayúscula";
      } else if (!/[0-9]/.test(password)) {
        errors.password = "La contraseña debe contener al menos un número";
      }
    }
  }

  // Confirmación de contraseñas (solo si es registro)
  if (register === true) {
    const confirmPassword = form.confirmPassword;

    if (!confirmPassword) {
      errors.confirmPassword = "La confirmación de contraseña es requerida";
    } else if (typeof confirmPassword !== "string") {
      errors.confirmPassword = "La confirmación de contraseña debe ser un texto";
    } else if (confirmPassword !== form.password) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }
  }

  // Retornar objeto con errores (si hay) o null si no hay errores
  return Object.keys(errors).length > 0 ? errors : null;
}