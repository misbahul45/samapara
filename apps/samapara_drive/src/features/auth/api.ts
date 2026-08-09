import type { LoginInput } from './schema';
import type { LoginResponse } from './types';

function displayNameFromEmail(email: string) {
  return email
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export async function login(payload: LoginInput): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const email = payload.email.trim().toLowerCase();

  return {
    user: {
      id: `demo:${email}`,
      name: displayNameFromEmail(email) || 'Pengguna Demo',
      email,
    },
  };
}
