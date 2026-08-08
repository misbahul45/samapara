import { apiPost } from '@/api/client';
import type { LoginInput } from './schema';
import type { LoginResponse } from './types';

export function login(payload: LoginInput) {
  return apiPost<LoginResponse>('/auth/login', { ...payload });
}
