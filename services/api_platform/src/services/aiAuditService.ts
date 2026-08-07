import { Prisma } from '../generated/prisma/client.js'
import { prisma } from '../lib/prisma.js'

export interface AiAuditLogInput {
  actor_type: string
  agent_name?: string | null
  action: string
  input?: unknown
  output?: unknown
  approved?: boolean | null
  approved_by?: string | null
}

export async function log(input: AiAuditLogInput) {
  const data: Prisma.ai_audit_logsUncheckedCreateInput = {
    actor_type: input.actor_type,
    agent_name: input.agent_name ?? null,
    action: input.action,
    approved: input.approved ?? null,
    approved_by: input.approved_by ?? null
  }
  if (input.input !== undefined) {
    data.input = input.input as Prisma.InputJsonValue
  }
  if (input.output !== undefined) {
    data.output = input.output as Prisma.InputJsonValue
  }
  return prisma.ai_audit_logs.create({ data })
}
