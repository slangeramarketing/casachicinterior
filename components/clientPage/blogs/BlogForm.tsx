"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/common/ImageUpload";
import { uploadImage } from "@/lib/uploadImage";

import { CiEdit } from "react-icons/ci";
import { FaReadme } from "react-icons/fa6";

import SwitchToggle from "../../common/SwitchToggle";
import { ResponseCategoryDTO } from "@/modules/blog-category/category.dto";
import { SubCategoryResponseDTO } from "@/modules/blog-subcategory/subcategory.dto";
import {
  BlogResponseDTO,
  CreateBlogDTO,
  UpdateBlogDTO,
} from "@/modules/blogs/blog.dto";
import { blogServer } from "@/modules/blogs/blog.server";

export type BlogFormMode = "create" | "view" | "edit";

interface Props {
  mode: BlogFormMode;
  categories: ResponseCategoryDTO[];
  subcategories: SubCategoryResponseDTO[];
  initialData?: BlogResponseDTO;

  onCreate?: (data: CreateBlogDTO) => Promise<void>;
  onUpdate?: (id: string, data: UpdateBlogDTO) => Promise<void>;
}


const LIMITS = {
  DESCRIPTION: 200,
  META_TITLE: 50,
  META_DESCRIPTION: 150,
};

export default function BlogForm({
  mode,
  categories,
  subcategories,
  initialData,
  onCreate,
  onUpdate
}: Props) {
  const router = useRouter();

  const [currentMode, setCurrentMode] =
    useState<BlogFormMode>(mode);

  const isView = currentMode === "view";
  const isCreate = currentMode === "create";
  const isEdit = currentMode === "edit";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [form, setForm] = useState<CreateBlogDTO>(() =>
    initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          description: initialData.description,
          richText: initialData.richText,
          thumbnailImage: initialData.thumbnailImage,
          categoryId: initialData.categoryId,
          subCategoryId: initialData.subCategoryId,
          status: initialData.status,
          featured: initialData.featured,
          seo: {
            metaTitle: initialData.seo?.metaTitle || "",
            metaDescription: initialData.seo?.metaDescription || "",
          },
        }
      : {
          title: "",
          slug: "",
          description: "",
          richText: "",
          thumbnailImage: "",
          categoryId: "",
          subCategoryId: "",
          status: "draft",
          featured: false,
          seo: {
            metaTitle: "",
            metaDescription: "",
          },
        }
  );

  /* -------------------------------------
     Derived SubCategories (by category)
  ------------------------------------- */
  const filteredSubCategories = useMemo(() => {
    if (!form.categoryId) return [];
    return subcategories.filter(
      (s) => s.categoryId === form.categoryId
    );
  }, [form.categoryId, subcategories]);

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  /* -------------------------------------
     Submit
  ------------------------------------- */
const handleSubmit = async (status: "draft" | "published") => {
  try {
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    let imageUrl = form.thumbnailImage;
    if (thumbnail) {
      imageUrl = await uploadImage(thumbnail, "blogs");
    }

    const payload = {
      ...form,
      status,
      slug: form.slug || generateSlug(form.title),
      thumbnailImage: imageUrl,
    };

    if (isCreate && onCreate) {
      await onCreate(payload as CreateBlogDTO);
    }

    if (isEdit && initialData && onUpdate) {
      await onUpdate(initialData.id, payload as UpdateBlogDTO);
    }

    router.push("/admin/blogs");
  } catch (err: any) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  /* -------------------------------------
     Validation
  ------------------------------------- */
  const validateForm = (): string | null => {
    if (!form.title.trim()) return "Title is required";
    if (!form.description?.trim())
      return "Short description is required";
    if (form.description.length > LIMITS.DESCRIPTION)
      return "Description limit exceeded";

    if (!form.categoryId) return "Category is required";
    if (!form.subCategoryId) return "Sub-category is required";

    if (!form.richText || form.richText === "<p></p>")
      return "Blog content is required";

    if ((form.seo?.metaTitle ?? "").length > LIMITS.META_TITLE)
      return "Meta title limit exceeded";

    if ((form.seo?.metaDescription ?? "").length > LIMITS.META_DESCRIPTION)
      return "Meta description limit exceeded";


    return null;
  };

  /* -------------------------------------
     UI
  ------------------------------------- */
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* MAIN */}
      <div className="w-full lg:w-[80%]">
        <label className="text-sm text-gray-500">Title</label>
        <input
          disabled={isView}
          className="w-full border rounded px-3 py-1 mb-4"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
              slug: generateSlug(e.target.value),
            })
          }
        />

        <RichTextEditor
          value={form.richText || ""}
          readOnly={isView}
          onChange={(v) =>
            setForm({ ...form, richText: v })
          }
        />
      </div>

      {/* SIDEBAR */}
      <div className="w-full lg:w-[20%] border rounded p-2">
        {mode !== "create" && (
          <div className="flex justify-end mb-3">
            {isView ? (
              <button onClick={() => setCurrentMode("edit")}>
                <CiEdit size={22} />
              </button>
            ) : (
              <button
                onClick={() => {
                  setForm({
                    ...form,
                    ...initialData!,
                  });
                  setCurrentMode("view");
                }}
              >
                <FaReadme size={20} />
              </button>
            )}
          </div>
        )}

        {/* CATEGORY */}
        <label className="text-xs">Category</label>
        <select
          disabled={isView}
          value={form.categoryId}
          onChange={(e) =>
            setForm({
              ...form,
              categoryId: e.target.value,
              subCategoryId: "",
            })
          }
          className="w-full border rounded px-2 py-1 mb-3"
        >
          <option value="">Select</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* SUBCATEGORY */}
        <label className="text-xs">Sub-Category</label>
        <select
          disabled={isView || !form.categoryId}
          value={form.subCategoryId}
          onChange={(e) =>
            setForm({
              ...form,
              subCategoryId: e.target.value,
            })
          }
          className="w-full border rounded px-2 py-1 mb-3"
        >
          <option value="">Select</option>
          {filteredSubCategories.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <SwitchToggle
          label="Featured"
          checked={form.featured || false}
          onChange={(v) =>
            setForm({ ...form, featured: v })
          }
        />

        {!isView && (
          <>
            <button
              onClick={() => handleSubmit("published")}
              className="w-full bg-green-600 text-white py-2 text-xs mt-4"
            >
              Publish
            </button>

            <button
              onClick={() => handleSubmit("draft")}
              className="w-full bg-gray-500 text-white py-2 text-xs mt-2"
            >
              Save Draft
            </button>
          </>
        )}

        {error && (
          <p className="text-red-500 text-xs mt-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
