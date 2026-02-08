// file location: components/admin/RichTextEditor.tsx


"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import EditorToolbar from "./EditorToolbar";

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
}

export default function RichTextEditor({
  value = "",
  onChange,
  readOnly = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: false,
        allowBase64: false, // ✅ FIXED
      }),
      Placeholder.configure({
        placeholder: "Start writing your blog...",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none min-h-[300px] prose-img:my-8 prose-p:my-4",
      },
    },
    onUpdate({ editor }) {
      if (!readOnly) {
        onChange?.(editor.getHTML());
      }
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [editor, readOnly]);

  if (!editor) return null;

  return (
    <div className="w-full border border-gray-300 rounded-md">
      {!readOnly && <EditorToolbar editor={editor} />}

      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
