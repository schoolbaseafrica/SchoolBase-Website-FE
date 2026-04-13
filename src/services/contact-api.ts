import { apiFetch } from "@/lib/api/client"

export interface ContactPayload {
  full_name: string
  email: string
  school_name: string
  contact_number: string
  message: string
}

export interface ContactResponse {
  message: string
  status: string
}

export function sendContactMessage(payload: ContactPayload) {
  return apiFetch<ContactResponse>(
    "/contact",
    {
      method: "POST",
      data: payload,
    },
    true // use backend proxy -> forwards to API_BASE_URL/contact (where API_BASE_URL includes /api/v1)
  )
}
