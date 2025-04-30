

import { useRef } from "react"
import { Button, InputBoxes } from "../Components"
import { useNavigate } from "react-router-dom"
import { userAuth } from "../store/userAuth"

export function Signin() {
  const usernameRef=useRef<HTMLInputElement>(null)
  const passwordRef=useRef<HTMLInputElement>(null)
  
  const nav = useNavigate()
  const { error, loading, login } = userAuth()

  const handleClick = async () => {
    const username=usernameRef.current?.value || ""
    const password=passwordRef.current?.value || ""
    const success = await login({ username, password })

    if (success) {
      nav("/dashboard")
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-900 flex justify-center items-center">
      <div className="w-[300px] bg-gray-300 flex flex-col px-4 py-6 justify-center rounded-xl gap-4 shadow-md">
        <span className="font-mono font-bold text-center text-2xl">LOGIN</span>

        <div className="flex flex-col gap-4">
          <InputBoxes
            placeholder="UserName"
            ref={usernameRef}
            type="text"
          />
          <InputBoxes
            placeholder="Password"
            type="password"
            ref={passwordRef}
          />
        </div>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <div className="flex justify-center mt-2">
          <Button size="md"
           variant="primary" text="Submit"
            onClick={handleClick}
         disabled={loading}
        />
        
        </div>
      </div>
    </div>
  )
}
