"use client"

import { useEffect, useState } from "react"
import { Button, Card, SideBar, ContentModal, ShareBrainModal } from "../Components"
import { UpdateContentModal } from "../Components/UpdateContentModal"
import { Plus, Loader2, Share2, AlignJustify } from "lucide-react"
import { type Content, type UpdatedContent, contentStore } from "../store/contentStore"
import brainStore from "../store/brainStore"
import { PasteLinkModal } from "../Components"

export function Dashboard() {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [linkInputOpen, setLinkInputOpen] = useState(false)

  const viewContent = contentStore((s:any) => s.viewContent)
  const addContent = contentStore((s:any) => s.addContent)
  const updateContent = contentStore((s:any) => s.updateContent)
  const loading = contentStore((s:any) => s.loading)
  const saveContent = contentStore((s:any) => s.saveContent)
  
  //@ts-ignore
  const content: Content[] = contentStore((s) => s.content)

  const [saveSuccess, setSaveSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        await viewContent()
      } catch (error) {
        console.error("Error fetching content:", error)
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchContent()
  }, [viewContent])

  const handleAdd = async (data: Omit<Content, "_id">) => {
    await addContent(data)
    setAddModalOpen(false)
  }

  const handleEditClick = (item: Content) => {
    setSelectedContent(item)
    setUpdateModalOpen(true)
  }

  const handleUpdate = async (data: UpdatedContent) => {
    await updateContent(data)
    setUpdateModalOpen(false)
    setSelectedContent(null)
  }

  const handleSave = async (id: string) => {
    const success = await saveContent(id)

    if (success) {
      // Show success message
      setSaveSuccess(id)
      setTimeout(() => {
        setSaveSuccess(null)
      }, 2000)
    }
  }

  const { shareBrain, setBrainShare, error, frontendLink } = brainStore()
  const handleShareBrain = async () => {
    setBrainShare(true)
    await shareBrain(true)
    setShareModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-6 px-4 md:pt-10 md:px-0">
      <div className="flex">
        <SideBar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <div className="md:hidden block">
              <AlignJustify
                size={24}
                className="text-gray-800 dark:text-white cursor-pointer hover:text-purple-600 transition-colors"
                onClick={() => setSidebarOpen((open) => !open)}
              />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Your Knowledge Hub</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              onClick={() => setAddModalOpen(true)}
              startIcon={<Plus size={16} />}
              text="Add Content"
              variant="primary"
              size="md"
              className="transition-all duration-300 ease-in-out w-full sm:w-auto hover:bg-purple-800"
            />
            <Button
              onClick={handleShareBrain}
              variant="secondary"
              text="Share Brain"
              size="md"
              startIcon={<Share2 size={18} />}
              className="transition-all duration-300 ease-in-out hover:bg-purple-600"
            />
            <Button
              onClick={() => setLinkInputOpen(true)}
              text="Load Another Brain"
              variant="secondary"
              size="md"
              startIcon={<Plus size={18} />}
              className="transition-all duration-300 ease-in-out hover:bg-purple-600"
            />
          </div>
        </div>

        <ContentModal open={addModalOpen} setOpen={setAddModalOpen} onSubmit={handleAdd} />
        <ShareBrainModal open={shareModalOpen} setOpen={setShareModalOpen} link={frontendLink} error={error} />
        <PasteLinkModal
          open={linkInputOpen}
          setOpen={setLinkInputOpen}
          onSubmit={(link) => (window.location.href = link)}
        />

        {selectedContent && (
          <UpdateContentModal
            open={updateModalOpen}
            setOpen={setUpdateModalOpen}
            data={selectedContent}
            onUpdate={handleUpdate}
          />
        )}

        {saveSuccess && (
          <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-md shadow-md z-50 animate-fadeIn">
            Content saved!
          </div>
        )}

        {isInitialLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 justify-items-center">
            {loading && !content ? (
              <div className="col-span-full flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : content && content.length > 0 ? (
              content.map((item) => (
                <Card
                  key={item._id}
                  _id={item._id!}
                  link={item.link}
                  title={item.title}
                  type={item.type}
                  viewOnly={false}
                  tags={item.tags || []}
                  onEdit={() => handleEditClick(item)}
                  onSave={() => handleSave(item._id!)}
                  savingState={loading && saveSuccess === item._id}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg border p-6 text-center">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 mb-4">
                  <Plus size={24} className="text-gray-400 dark:text-gray-200" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">No content yet</h3>
                <p className="text-gray-500 dark:text-gray-300 mb-4">Add your first piece of content to get started</p>
                <Button onClick={() => setAddModalOpen(true)} text="Add Content" variant="primary" size="sm" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
