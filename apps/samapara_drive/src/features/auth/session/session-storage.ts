import { getSecureItem, removeSecureItem, setSecureItem } from '@/shared/storage/secure-storage';
import { authSessionSchema } from '../schema';
import type { AuthSession } from '../types';

const SESSION_KEY = 'samapara.auth.session';

export async function readAuthSession(): Promise<AuthSession | null> {
  const value = await getSecureItem(SESSION_KEY);

  if (!value) {
    return null;
  }

  let data: unknown;

  try {
    data = JSON.parse(value);
  } catch {
    await removeSecureItem(SESSION_KEY);
    return null;
  }

  const parsed = authSessionSchema.safeParse(data);

  if (!parsed.success) {
    await removeSecureItem(SESSION_KEY);
    return null;
  }

  return parsed.data;
}

export async function persistAuthSession(session: AuthSession) {
  await setSecureItem(SESSION_KEY, JSON.stringify(session));
}

export async function clearAuthSession() {
  await removeSecureItem(SESSION_KEY);
}
