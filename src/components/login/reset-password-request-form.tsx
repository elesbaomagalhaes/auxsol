"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, Eye, EyeOff, Key } from "lucide-react"

export default function PasswordReset() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [isCodeVerified, setIsCodeVerified] = useState(true) // Set to true to match the screenshot

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Handle verification code input
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0)
    }

    if (value && /^[0-9]$/.test(value)) {
      const newCode = [...verificationCode]
      newCode[index] = value
      setVerificationCode(newCode)

      // Move focus to next input
      if (index < 5 && value) {
        // Skip the middle dot position (index 3)
        const nextIndex = index === 2 ? 3 : index + 1
        inputRefs.current[nextIndex]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !verificationCode[index]) {
      // Move focus to previous input on backspace if current input is empty
      if (index > 0) {
        // Skip the middle dot position (index 3)
        const prevIndex = index === 3 ? 2 : index - 1
        inputRefs.current[prevIndex]?.focus()
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
          <p className="text-gray-500">
            Enter the code sent to <span className="font-medium text-black">info@pixsellz.io</span> to reset your
            password.
          </p>
        </div>

        {/* Verification code input */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2, "•", 3, 4, 5].map((item, index) => {
            if (item === "•") {
              return (
                <div key="dot" className="flex h-12 w-12 items-center justify-center text-center text-lg">
                  •
                </div>
              )
            }

            const inputIndex = typeof item === "number" ? item : 0

            return (
              <div key={index} className="flex h-12 w-12 items-center justify-center">
                <Input
                  ref={(el) => {
                    inputRefs.current[inputIndex] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={verificationCode[inputIndex]}
                  onChange={(e) => handleCodeChange(inputIndex, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(inputIndex, e)}
                  className="h-full w-full rounded-md text-center text-lg p-0"
                />
              </div>
            )
          })}
        </div>

        {/* Verification status */}
        {isCodeVerified && (
          <div className="flex items-center justify-center text-green-500">
            <Check className="mr-2 h-5 w-5" />
            <span>Code verified</span>
          </div>
        )}

        <div className="h-px bg-gray-200" />

        {/* New password section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-base font-medium">
              New password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <Key className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" className="w-28">
              Cancel
            </Button>
            <Button className="w-40 bg-gray-400 hover:bg-gray-500">Reset password</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
