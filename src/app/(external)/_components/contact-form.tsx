"use client"

import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { sendContactMessage } from "@/services/contact-api"
import { AnimatedList, AnimatedListItem } from "./page-animations"

const COUNTRY_CODES = [
  { label: "Nigeria", value: "+234" },
  { label: "Ghana", value: "+233" },
  { label: "Kenya", value: "+254" },
  { label: "South Africa", value: "+27" },
  { label: "Egypt", value: "+20" },
  { label: "United States", value: "+1" },
  { label: "United Kingdom", value: "+44" },
  { label: "India", value: "+91" },
]

const contactSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  school_name: z.string().min(1, "School name is required"),
  contact_number: z.string().regex(/^\d{10}$/, "Contact number must be 10 digits"),
  message: z.string().min(1, "Message cannot be empty"),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactForm() {
  const [countryCode, setCountryCode] = useState("+234")
  const [formData, setFormData] = useState<ContactFormData>({
    full_name: "",
    email: "",
    school_name: "",
    contact_number: "",
    message: "",
  })

  const [errors, setErrors] = useState<Partial<ContactFormData>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === "contact_number") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10)
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = contactSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Partial<ContactFormData> = {}

      result.error.issues.forEach((err) => {
        const fieldName = err.path[0] as keyof ContactFormData
        fieldErrors[fieldName] = err.message
      })

      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsLoading(true)

    try {
      await sendContactMessage({
        ...formData,
        contact_number: `${countryCode}${formData.contact_number}`,
      })
      toast.success(`Thank you, ${formData.full_name}! Your message has been sent.`)

      setFormData({
        full_name: "",
        email: "",
        school_name: "",
        contact_number: "",
        message: "",
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <AnimatedList className="space-y-4" stagger={0.1}>
        <AnimatedListItem>
          <div>
            <label htmlFor="full_name" className="mb-1 block font-medium">
              Full Name
            </label>
            <Input
              id="full_name"
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full"
              disabled={isLoading}
            />
            {errors.full_name && (
              <p className="text-sm text-red-500">{errors.full_name}</p>
            )}
          </div>
        </AnimatedListItem>

        <AnimatedListItem>
          <div>
            <label htmlFor="email" className="mb-1 block font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full"
              disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
        </AnimatedListItem>

        <AnimatedListItem>
          <div>
            <label htmlFor="school_name" className="mb-1 block font-medium">
              School Name
            </label>
            <Input
              id="school_name"
              type="text"
              name="school_name"
              value={formData.school_name}
              onChange={handleChange}
              className="w-full"
              disabled={isLoading}
            />
            {errors.school_name && (
              <p className="text-sm text-red-500">{errors.school_name}</p>
            )}
          </div>
        </AnimatedListItem>

        <AnimatedListItem>
          <div>
            <label htmlFor="contact_number" className="mb-1 block font-medium">
              Contact Number
            </label>
            <div className="flex">
              <Select
                value={countryCode}
                onValueChange={setCountryCode}
                disabled={isLoading}
              >
                <SelectTrigger className="w-[140px] rounded-r-none border-r-0">
                  <SelectValue placeholder="Code" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_CODES.map((option) => (
                    <SelectItem
                      key={`${option.label}-${option.value}`}
                      value={option.value}
                    >
                      {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="contact_number"
                type="text"
                name="contact_number"
                inputMode="numeric"
                pattern="^[0-9]{10}$"
                maxLength={10}
                value={formData.contact_number}
                onChange={handleChange}
                className="w-full rounded-l-none"
                disabled={isLoading}
              />
            </div>
            {errors.contact_number && (
              <p className="text-sm text-red-500">{errors.contact_number}</p>
            )}
          </div>
        </AnimatedListItem>

        <AnimatedListItem>
          <div>
            <label htmlFor="message" className="mb-1 block font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full rounded-xl border px-3 py-2"
              rows={4}
              disabled={isLoading}
            />
            {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
          </div>
        </AnimatedListItem>

        <AnimatedListItem>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </AnimatedListItem>
      </AnimatedList>
    </form>
  )
}
