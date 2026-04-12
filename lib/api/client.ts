import type { ApiErrorResponse } from "@/lib/api/types"

const DEFAULT_API_BASE_URL = "/backend"

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

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  authToken?: string | null
  body?: unknown
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

export async function apiClient<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { authToken, body, headers, ...rest } = options

  const mergedHeaders = new Headers(headers)
  if (!mergedHeaders.has("Content-Type") && body !== undefined) {
    mergedHeaders.set("Content-Type", "application/json")
  }

  if (authToken) {
    mergedHeaders.set("Authorization", `Bearer ${authToken}`)
  }

  const response = await fetch(buildApiUrl(endpoint), {
    ...rest,
    headers: mergedHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    throw await parseError(response)
  }

  if (response.status === 204) {
    return null as T
  }

  const contentType = response.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    return null as T
  }

  return response.json() as Promise<T>
}
