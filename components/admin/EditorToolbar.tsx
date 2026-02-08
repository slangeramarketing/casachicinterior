// file location: components/admin/EditorToolbar.tsx

"use client";

import { useState } from "react";
import { Editor } from "@tiptap/react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaHeading,
  FaCode,
  FaImage,
  FaUndo,
  FaRedo,
} from "react-icons/fa";

import ImagePicker from "@/components/common/ImagePicker";
import { uploadImage } from "@/lib/uploadImage";

interface ToolbarProps {
  editor: Editor;
}

export default function EditorToolbar({ editor }: ToolbarProps) {
  const [openImagePicker, setOpenImagePicker] =
    useState(false);

  const Button = ({
    onClick,
    active,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded transition ${active ? "bg-gray-300" : "hover:bg-gray-200"
        }`}
    >
      {children}
    </button>
  );

  return (
    <>
      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-1 bg-gray-50 p-2 border-b border-gray-300 rounded-t-md">
        <Button onClick={() => editor.chain().focus().undo().run()}>
          <FaUndo size={14} />
        </Button>

        <Button onClick={() => editor.chain().focus().redo().run()}>
          <FaRedo size={14} />
        </Button>

        <Button
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          active={editor.isActive("bold")}
        >
          <FaBold size={14} />
        </Button>

        <Button
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          active={editor.isActive("italic")}
        >
          <FaItalic size={14} />
        </Button>

        <Button
          onClick={() =>
            editor.chain().focus().toggleUnderline().run()
          }
          active={editor.isActive("underline")}
        >
          <FaUnderline size={14} />
        </Button>

        {/* HEADINGS H1 - H6 */}
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <Button
            key={level}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
                .run()
            }
            active={editor.isActive("heading", { level })}
          >
            <span className="font-bold text-xs">H{level}</span>
          </Button>
        ))}

        <Button
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          active={editor.isActive("bulletList")}
        >
          <FaListUl size={14} />
        </Button>

        <Button
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          active={editor.isActive("orderedList")}
        >
          <FaListOl size={14} />
        </Button>

        <Button
          onClick={() =>
            editor.chain().focus().toggleCodeBlock().run()
          }
          active={editor.isActive("codeBlock")}
        >
          <FaCode size={14} />
        </Button>

        {/* 🔥 IMAGE BUTTON */}
        <Button onClick={() => setOpenImagePicker(true)}>
          <FaImage size={14} />
        </Button>
      </div>

      {/* IMAGE PICKER */}
      {openImagePicker && (
        <ImagePicker
          autoOpen
          value={null}
          onChange={async (val) => {
            if (!val) return;

            let imageUrl: string;

            if (val instanceof File) {
              imageUrl = await uploadImage(val, "blogs");
            } else {
              imageUrl = val;
            }

            editor
              .chain()
              .focus()
              .setImage({ src: imageUrl })
              .run();

            setOpenImagePicker(false);
          }}
        />
      )}
    </>
  );
}
