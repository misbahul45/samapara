import { getEnv } from '../config/env.js'
import { upstreamJson } from './internalHttp.js'

export interface ForecastRunResult {
  deviceId: string
  p50: number
  p80: number
  p90: number
}

interface ForecastRunResponse {
  status: boolean
  data: ForecastRunResult
}

export async function runForecast(deviceId: string): Promise<ForecastRunResult> {
  const response = await upstreamJson<ForecastRunResponse>(
    getEnv().decisionEngineUrl,
    '/internal/v1/forecast/run',
    {
      method: 'POST',
      body: JSON.stringify({ deviceId }),
    },
  )
  return response.data
}
