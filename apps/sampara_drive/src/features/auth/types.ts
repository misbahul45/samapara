import type { z } from 'zod';
import type { authSessionSchema, authUserSchema } from './schema';

export type User = z.infer<typeof authUserSchema>;
export type AuthSession = z.infer<typeof authSessionSchema>;
export type LoginResponse = AuthSession;
