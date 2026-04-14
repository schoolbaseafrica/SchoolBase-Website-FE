"use client"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import React, { useState } from "react"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { COUNTRY_CALLING_CODES } from "@/constants/country-codes"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { toast } from "sonner"
import { sendContactMessage } from "@/services/contact-api"
import { AnimatedList, AnimatedListItem } from "./page-animations"

const contactSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  school_name: z.string().min(1, "School name is required"),
  contact_number: z.string().regex(/^\d{10}$/, "Contact number must be 10 digits"),
  message: z.string().min(1, "Message cannot be empty"),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactForm() {
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false)
  const [selectedCountryName, setSelectedCountryName] = useState("Nigeria")
  const [formData, setFormData] = useState<ContactFormData>({
    full_name: "",
    email: "",
    school_name: "",
    contact_number: "",
    message: "",
  })

  const [errors, setErrors] = useState<Partial<ContactFormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const selectedCountry =
    COUNTRY_CALLING_CODES.find((country) => country.name === selectedCountryName) ??
    COUNTRY_CALLING_CODES.find((country) => country.name === "Nigeria") ??
    COUNTRY_CALLING_CODES[0]

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
        contact_number: `${selectedCountry.code}${formData.contact_number}`,
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
              <Popover open={isCountryPickerOpen} onOpenChange={setIsCountryPickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={isCountryPickerOpen}
                    className="border-input h-12 w-36 justify-between rounded-r-none border-r-0 bg-transparent px-3 text-sm font-normal text-black shadow-xs hover:text-white sm:w-48"
                    disabled={isLoading}
                  >
                    <span className="truncate">
                      {selectedCountry.name} ({selectedCountry.code})
                    </span>
                    <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search country or code..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      {COUNTRY_CALLING_CODES.map((country) => (
                        <CommandItem
                          key={country.name}
                          value={`${country.name} ${country.code} ${country.code.replace(/\D/g, "")}`}
                          className="data-[selected=true]:text-white"
                          onSelect={() => {
                            setSelectedCountryName(country.name)
                            setIsCountryPickerOpen(false)
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 size-4",
                              selectedCountryName === country.name
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {country.name} ({country.code})
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
