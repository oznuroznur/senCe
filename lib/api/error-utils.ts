import { ApiError } from "@/lib/api/client"

export function getReadableApiError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.statusCode === 401) return "You need to sign in to continue."
    if (error.statusCode === 403) return "You do not have permission for this action."
    if (error.statusCode === 404) return "The requested resource was not found."
    if (error.statusCode === 400) return error.message || "Please check your input and try again."
    return error.message || "Something went wrong."
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Unexpected error occurred."
}
