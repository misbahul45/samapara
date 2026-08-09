import type { LoginInput } from '../schema';
import type { LoginResponse } from '../types';

const DEMO_LOGIN_DELAY = 700;

function displayNameFromEmail(email: string) {
  return email
    .split('@')[0]
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export async function authenticateLocally(payload: LoginInput): Promise<LoginResponse> {
  await new Promise((resolve) => setTimeout(resolve, DEMO_LOGIN_DELAY));
  const email = payload.email.trim().toLowerCase();

  return {
    user: {
      id: `demo:${email}`,
      name: displayNameFromEmail(email) || 'Pengemudi SAMPARA',
      email,
    },
  };
}
