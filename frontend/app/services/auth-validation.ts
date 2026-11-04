export type AuthFieldErrors = Record<string, string>;

const EMAIL_PATTERN = /^[A-Za-z0-9+_.-]+@(.+)$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#_\-]).{8,64}$/;

export function validateLogin(email: string, password: string): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  if (!email.trim()) errors.email = "Introduce tu correo electrónico.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Introduce un correo válido.";
  if (!password) errors.password = "Introduce tu contraseña.";
  return errors;
}

function isAdult(birthDate: string) {
  if (!birthDate) return false;
  const date = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(date.getTime()) || date > new Date()) return false;

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const beforeBirthday =
    today.getMonth() < date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() < date.getDate());
  if (beforeBirthday) age -= 1;
  return age >= 18;
}

export function validateRegistration(values: {
  username: string;
  email: string;
  password: string;
  birthDate: string;
}): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  const username = values.username.trim();

  if (username.length < 3 || username.length > 30) {
    errors.username = "El usuario debe tener entre 3 y 30 caracteres.";
  } else if (!USERNAME_PATTERN.test(username)) {
    errors.username = "Usa solo letras, números y guion bajo.";
  }

  if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = "Introduce un correo válido.";
  }

  if (values.password.length < 8 || values.password.length > 64) {
    errors.password = "La contraseña debe tener entre 8 y 64 caracteres.";
  } else if (/\s/.test(values.password) || !PASSWORD_PATTERN.test(values.password)) {
    errors.password = "Incluye mayúscula, minúscula, número y símbolo; no uses espacios.";
  }

  if (!values.birthDate) {
    errors.birthDate = "Introduce tu fecha de nacimiento.";
  } else if (!isAdult(values.birthDate)) {
    errors.birthDate = "Debes tener al menos 18 años para registrarte.";
  }

  return errors;
}
