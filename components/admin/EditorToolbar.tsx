"use client";

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

interface ToolbarProps {
  editor: Editor;
}

export default function EditorToolbar({ editor }: ToolbarProps) {
  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

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
      className={`p-2 rounded transition ${
        active ? "bg-gray-300" : "hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-1 bg-gray-50 p-2 border-b border-gray-300 rounded-tl-md rounded-tr-md">
      <Button onClick={() => editor.chain().focus().undo().run()}>
        <FaUndo size={14} />
      </Button>

      <Button onClick={() => editor.chain().focus().redo().run()}>
        <FaRedo size={14} />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      >
        <FaBold size={14} />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      >
        <FaItalic size={14} />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
      >
        <FaUnderline size={14} />
      </Button>

      <Button
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        active={editor.isActive("heading", { level: 2 })}
      >
        <FaHeading size={14} />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      >
        <FaListUl size={14} />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      >
        <FaListOl size={14} />
      </Button>

      <Button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
      >
        <FaCode size={14} />
      </Button>

      <Button onClick={addImage}>
        <FaImage size={14} />
      </Button>
    </div>
  );
}
