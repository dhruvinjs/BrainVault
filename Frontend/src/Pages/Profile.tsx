import { useState, useEffect, useRef } from "react"
import { userAuth } from "../store/userAuth"
import { contentStore, Content } from "../store/contentStore"
import { Button } from "../Components/Button"
import { Loader2, Camera, Save, X, CheckCircle, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function Profile() {
  const { user, loading, error, checkAuth, editProfile } = userAuth()
  const [isEditing, setEditing] = useState(false)
  const [usernameUpdated, setUsernameUpdated] = useState(false)

  // Refs for the uncontrolled inputs
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  // Content store for stats
  const viewContent = contentStore((s:any) => s.viewContent) 
  const content: Content[] = contentStore((s:any) => s.content) ?? []

  // fetch auth + content on mount
  useEffect(() => {
    checkAuth()
    viewContent()
  }, [checkAuth, viewContent])

  const handleSave = async () => {
    const newUsername = usernameRef.current?.value.trim() ?? user!.username
    const newPassword = passwordRef.current?.value ?? ""

    const payload: any = { username: newUsername }
    if (newPassword) payload.password = newPassword

    if (await editProfile(payload)) {
      setUsernameUpdated(true)
      setTimeout(() => setUsernameUpdated(false), 2000) // reset after 2 seconds
      setEditing(false)
      if (passwordRef.current) passwordRef.current.value = ""
    }
  }

  // stats
  const totalCount   = content.length
  const twitterCount = content.filter((c) => c.type === "twitter").length
  const youtubeCount = content.filter((c) => c.type === "youtube").length

  if (!user) return <p className="text-center pt-20">Loading profile…</p>
  const nav=useNavigate()
  return (
    <div className="min-h-screen bg-slate-200 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <Button 
      size="md"
      onClick={()=>nav('/dashboard')}
      variant="primary"
      text="Back To Your Brain"
      className="mt-10"
      startIcon={<ArrowLeft size={18} />}
      />
          <div className="bg-primary p-6 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">Profile</h1>
            {!isEditing && (
              <Button
                variant="dark"
                size="sm"
                text="Edit Profile"
                onClick={() => setEditing(true)}
                className="bg-white text-primary hover:bg-purple-500 transition duration-300"
              />
            )}
          </div>
          <div className="p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                  <img
                    src="https://i.pravatar.cc/300"  // <-- your static avatar URL
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <button
                    className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md hover:bg-primary/90"
                    aria-label="Change profile picture"
                  >
                    <Camera size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Form or Display */}
            {isEditing ? (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      placeholder=""
                      ref={usernameRef}
                      defaultValue={user.username}
                      type="text"
                      className={`w-full px-4 py-2 border rounded-md outline-purple-500 ${usernameUpdated ? "border-green-500" : ""}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      ref={passwordRef}
                      placeholder="(leave blank to keep current)"
                      type="password"
                      className="w-full px-4 py-2 border rounded-md outline-purple-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                  <Button
                    variant="dark"
                    size="md"
                    text="Cancel"
                    onClick={() => setEditing(false)}
                    startIcon={<X size={16} />}
                  />
                  <Button
                    variant="primary"
                    size="md"
                    text={loading ? "Saving..." : "Save Changes"}
                    onClick={handleSave}
                    disabled={loading}
                    startIcon={
                      loading
                        ? <Loader2 className="animate-spin" size={16} />
                        : <Save size={16} />
                    }
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <p><strong>Username:</strong> {user.username}</p>
                {usernameUpdated && (
                  <p className="text-green-500 flex items-center gap-2">
                    <CheckCircle size={16} /> Username updated successfully!
                  </p>
                )}
              </div>
            )}

            {error && (
              <p className="text-red-500 mt-4 fade-in">{error}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-1">Content Items</h3>
            <p className="text-3xl font-bold text-primary">{totalCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-1">Twitter Threads</h3>
            <p className="text-3xl font-bold text-blue-500">{twitterCount}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-1">YouTube Videos</h3>
            <p className="text-3xl font-bold text-red-500">{youtubeCount}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
