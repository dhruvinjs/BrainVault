
import type React from "react"

import { useNavigate } from "react-router-dom"
import { Button } from "../Components/Button"
import { InputBoxes } from "../Components/Input"
import { useState,useRef } from "react"
import { userAuth } from "../store/userAuth"
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react"

export function Signup() {
  const usernameRef= useRef<HTMLInputElement |  null>(null)
  const passwordRef=useRef<HTMLInputElement | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const nav = useNavigate()

  //@ts-ignore
  const { signup, loading, error } = userAuth()

  const handleClick = async () => {
    const username=usernameRef.current?.value.trim() || ""
    const password=passwordRef.current?.value || ""
    const success = await signup({ username, password })
    if (success) nav("/login")
  }
  const passwordValue=passwordRef.current?.value || ""
  // Password validation checks
  const hasUpperCase = /[A-Z]/.test(passwordValue)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)
  const hasMinLength = passwordValue.length >= 6

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-900">
      <div className="w-[320px] bg-gray-300 rounded-xl flex flex-col px-6 py-8 justify-center gap-6 shadow-lg">
        <h1 className="font-bold font-mono text-center text-2xl">Create Account</h1>

        <div className="flex flex-col gap-5 items-center ">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <InputBoxes
              placeholder="Enter your username"
              type="text"
              ref={usernameRef}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <InputBoxes
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                ref={passwordRef}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password requirements */}
            <div className="mt-2 space-y-1.5">
              <p className="text-xs font-medium text-gray-700 mb-1">Password requirements:</p>
              <div className="flex items-center gap-1.5">
                {hasMinLength ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-gray-300" />
                )}
                <span className={`text-xs ${hasMinLength ? "text-green-600" : "text-gray-500"}`}>
                  At least 6 characters
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasUpperCase ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-gray-300" />
                )}
                <span className={`text-xs ${hasUpperCase ? "text-green-600" : "text-gray-500"}`}>
                  At least 1 uppercase letter
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasSpecialChar ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-gray-300" />
                )}
                <span className={`text-xs ${hasSpecialChar ? "text-green-600" : "text-gray-500"}`}>
                  At least 1 special character
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">{error}</div>
        )}

        <div className="flex flex-col gap-4">
          <Button size="md" variant="primary" onClick={handleClick} 
          disabled={loading} className="w-full" text="Create Account">
           
          </Button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button onClick={() => nav("/login")} className="text-primary font-medium hover:underline">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
