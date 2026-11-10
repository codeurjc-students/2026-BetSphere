export type AuthFieldErrors = Record<string, string>;

const EMAIL_PATTERN = /^[A-Za-z0-9+_.-]+@(.+)$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#_\-]).{8,64}$/;

export function validateLogin(email: string, password: string): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  if (!email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Enter your password.";
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
    errors.username = "Username must be between 3 and 30 characters.";
  } else if (!USERNAME_PATTERN.test(username)) {
    errors.username = "Use only letters, numbers, and underscores.";
  }

  if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (values.password.length < 8 || values.password.length > 64) {
    errors.password = "Password must be between 8 and 64 characters.";
  } else if (/\s/.test(values.password) || !PASSWORD_PATTERN.test(values.password)) {
    errors.password = "Include uppercase, lowercase, number, and symbol; do not use spaces.";
  }

  if (!values.birthDate) {
    errors.birthDate = "Enter your birth date.";
  } else if (!isAdult(values.birthDate)) {
    errors.birthDate = "You must be at least 18 years old to register.";
  }

  return errors;
}
