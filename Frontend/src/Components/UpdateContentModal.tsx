import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const titleRef = useRef<HTMLInputElement>(null);
  const typeRef  = useRef<HTMLInputElement>(null);
  const linkRef  = useRef<HTMLInputElement>(null);

  // *** Only tags are in state as a comma-string ***
  const [tagsString, setTagsString] = useState(data.tags.join(", "));

  // Reset everything when opened
  useEffect(() => {
    if (!open) return;
    if (titleRef.current) titleRef.current.value = data.title;
    if (typeRef.current)  typeRef.current.value  = data.type;
    if (linkRef.current)  linkRef.current.value  = data.link;
    setTagsString(data.tags.join(", "));
  }, [open, data]);

  if (!open) return null;

  const handleUpdate = () => {
    const tagArray = tagsString
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);

    const updated: UpdatedContent = {
      _id: data._id!,
      title: titleRef.current?.value || data.title,
      type:  typeRef.current?.value  || data.type,
      link:  linkRef.current?.value  || data.link,
      tags:  tagArray,
    };

    onUpdate(updated);
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-opaque-60 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[400px] relative shadow-xl">
        <X
          size={30}
          className="absolute top-6 right-6 cursor-pointer hover:bg-gray-300 rounded-full p-1"
          onClick={() => setOpen(false)}
        />

        <h2 className="text-xl font-semibold text-center mb-4">Edit Content</h2>

        <div className="flex flex-col gap-3">
          <InputBoxes ref={titleRef} type="text" placeholder="Title" />
          <InputBoxes ref={typeRef}  type="text" placeholder="Type" />
          <InputBoxes ref={linkRef}  type="text" placeholder="Link" />

          <InputBoxes
            type="text"
            placeholder="Tags (comma-separated)"
            value={tagsString}
            onChange={(e) => setTagsString(e.target.value)}
          />
        </div>

        <div className="mt-4 text-center">
          <Button variant="primary" size="md" onClick={handleUpdate} text="Submit" />
        </div>
      </div>
    </div>
  );
}
