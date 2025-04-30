"use client"

import { useState, useEffect, useRef } from "react"
import { userAuth } from "../store/userAuth"
import { contentStore, type Content } from "../store/contentStore"
import { Button } from "../Components/Button"
import { Loader2, Save, X, CheckCircle, ArrowLeft, User, Twitter, Youtube, FileText, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function Profile() {
  const { user, loading, error, checkAuth, editProfile } = userAuth()
  const [isEditing, setEditing] = useState(false)
  const [usernameUpdated, setUsernameUpdated] = useState(false)

  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const viewContent = contentStore((s: any) => s.viewContent)
  const content: Content[] = contentStore((s: any) => s.content) ?? []

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

  const totalCount = content.length
  const twitterCount = content.filter((c) => c.type === "twitter").length
  const youtubeCount = content.filter((c) => c.type === "youtube").length
  const otherCount = totalCount - twitterCount - youtubeCount

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-200 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
          <p className="text-gray-700 text-lg">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6 flex items-center">
          <Button
            size="sm"
            onClick={() => navigate("/dashboard")}
            variant="dark"
            text="Back to Dashboard"
            startIcon={<ArrowLeft size={16} />}
            className="hover:bg-white/80 transition-colors"
          />
          <h1 className="text-2xl font-bold ml-4 text-gray-800">Your Profile</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Card */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <User size={20} />
                Account Information
              </h2>
              {!isEditing && (
                <Button
                  variant="primary"
                  size="sm"
                  text="Edit Profile"
                  onClick={() => setEditing(true)}
                  className="bg-white/10 border-white/20 hover:bg-white/20 text-white transition duration-300"
                />
              )}
            </div>

            <div className="p-6">
              {/* Username header - simplified without avatar */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800">{user.username}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
                  <Shield size={14} className="text-green-500" />
                  <span>Verified Account</span>
                </div>
              </div>

              {/* Form or Display */}
              {isEditing ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input
                        placeholder=""
                        ref={usernameRef}
                        defaultValue={user.username}
                        type="text"
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                          usernameUpdated ? "border-green-500 ring-green-500/50" : ""
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        ref={passwordRef}
                        placeholder="(leave blank to keep current)"
                        type="password"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 8 characters and include a number and special character.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end mt-6">
                    <Button
                      variant="outline"
                      size="md"
                      text="Cancel"
                      onClick={() => setEditing(false)}
                      startIcon={<X size={16} />}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    />
                    <Button
                      variant="primary"
                      size="md"
                      text={loading ? "Saving..." : "Save Changes"}
                      onClick={handleSave}
                      disabled={loading}
                      startIcon={loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-gray-300 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-1">Username</p>
                      <p className="font-medium">{user.username}</p>
                    </div>
                    </div>

                  {usernameUpdated && (
                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md flex items-center gap-2 animate-fadeIn">
                      <CheckCircle size={16} />
                      <span>Profile updated successfully!</span>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md mt-4 animate-fadeIn">
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Account Info Sidebar */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <User size={18} className="text-purple-500" />
                Account Status
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Active</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Last Login</span>
                  <span className="font-medium">Today</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Account Type</span>
                  <span className="font-medium">Standard</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <FileText size={18} className="text-purple-500" />
                Content Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <FileText size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">{totalCount} Total Items</p>
                    <p className="text-sm text-gray-500">All content</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Twitter size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{twitterCount} Twitter Threads</p>
                    <p className="text-sm text-gray-500">
                      {Math.round((twitterCount / totalCount) * 100) || 0}% of content
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Youtube size={18} className="text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">{youtubeCount} YouTube Videos</p>
                    <p className="text-sm text-gray-500">
                      {Math.round((youtubeCount / totalCount) * 100) || 0}% of content
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
