import { apiClient } from "@/lib/api/client"
import type { Topic } from "@/lib/api/types"

export async function listTopics() {
  return apiClient<Topic[]>("/topics")
}
