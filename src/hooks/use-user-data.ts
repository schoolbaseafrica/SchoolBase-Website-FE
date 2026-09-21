"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { getUserData, sendLogoutRequest } from "@/lib/api/auth"

const USER_DATA_KEY = ["user"]

export function useGetUser() {
  return useQuery({
    queryKey: USER_DATA_KEY,
    queryFn: () => getUserData(),
    select: (data) => data.data,
    staleTime: 1000 * 60 * 60,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: sendLogoutRequest,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: USER_DATA_KEY })

      router.push("/login")
    },
  })
}
