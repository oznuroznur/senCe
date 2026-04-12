import type { ApiErrorResponse } from "@/lib/api-types"

const DEFAULT_API_BASE_URL = "http://localhost:4000/"

export class ApiError extends Error {
  statusCode: number
  error: string
  details?: ApiErrorResponse["details"]

  constructor(payload: ApiErrorResponse) {
    super(payload.message || "API Error")
    this.name = "ApiError"
    this.statusCode = payload.statusCode
    this.error = payload.error
    this.details = payload.details
  }
}

export function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "")
}

export function buildApiUrl(endpoint: string) {
  if (/^https?:\/\//.test(endpoint)) {
    return endpoint
  }

  return `${getApiBaseUrl()}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`
}

async function parseError(response: Response): Promise<ApiError> {
  try {
    const payload = (await response.json()) as ApiErrorResponse
    return new ApiError(payload)
  } catch {
    return new ApiError({
      statusCode: response.status,
      message: response.statusText || "API Error",
      error: "Request Failed",
    })
  }
}

export async function apiFetch<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(buildApiUrl(endpoint), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  })

  if (!response.ok) {
    throw await parseError(response)
  }

  if (response.status === 204) {
    return null as T
  }

  return response.json() as Promise<T>
}

export async function safeApiFetch<T>(endpoint: string, init: RequestInit = {}): Promise<T | null> {
  try {
    return await apiFetch<T>(endpoint, init)
  } catch {
    return null
  }
}