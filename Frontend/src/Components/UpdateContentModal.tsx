import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./Button";
import { InputBoxes } from "./Input";
import { Content, UpdatedContent } from "../store/contentStore";

interface UpdateContentModalProps {
  data: Content;
  open: boolean;
  setOpen: (open: boolean) => void;
  onUpdate: (data: UpdatedContent) => void;
}

export function UpdateContentModal({
  data,
  open,
  setOpen,
  onUpdate,
}: UpdateContentModalProps) {
  const [title, setTitle] = useState(data.title);
  const [type, setType]   = useState(data.type);
  const [link, setLink]   = useState(data.link);
  const [tags, setTags]   = useState(data.tags);

  // Whenever the modal opens, reset inputs to the passed-in data
  useEffect(() => {
    if (open) {
      setTitle(data.title);
      setType(data.type);
      setLink(data.link);
      setTags(data.tags);
    }
  }, [open, data]);

  // If the modal is closed, render nothing
  if (!open) return null;

  // Called when the user clicks "Submit"
  const handleUpdate = () => {
    onUpdate({
      _id: data._id!,   // assume it's always defined when editing
      title,
      type,
      link,
      tags,
    });
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-opaque-60 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[400px] relative shadow-xl">

        <X size={30} className="absolute top-6 right-6 cursor-pointer rounded-full
        transition-all duration-300 ease-in-out hover:bg-gray-300" onClick={() => setOpen(false)} />
          

        <h2 className="text-xl font-semibold text-center mb-4">
          Edit Content
        </h2>

        <div className="flex flex-col gap-3">
          <InputBoxes
            type="text"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <InputBoxes
            type="text"
            value={type}
            placeholder="Type"
            onChange={(e) => setType(e.target.value)}
          />
          <InputBoxes
            type="text"
            value={link}
            placeholder="Link"
            onChange={(e) => setLink(e.target.value)}
          />
          <InputBoxes
            type="text"
            value={tags}
            placeholder="Tags"
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="mt-4 text-center">
          <Button
            variant="primary"
            size="md"
            onClick={handleUpdate}
            text="Submit"
          />
        </div>
      </div>
    </div>
  );
}
