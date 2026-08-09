import type { AuthUser, LoginInput } from '../types'

function displayNameFromEmail(email: string) {
  const localPart = email.split('@')[0] ?? ''

  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export async function authenticateDemo(input: LoginInput): Promise<AuthUser> {
  await new Promise(resolve => setTimeout(resolve, 400))
  const email = input.email.trim().toLowerCase()

  return {
    id: `demo:${email}`,
    name: displayNameFromEmail(email) || 'Pengguna Demo',
    email
  }
}
