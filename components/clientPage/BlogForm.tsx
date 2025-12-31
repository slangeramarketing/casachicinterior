"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUpload from "@/components/common/ImageUpload";
import { uploadImage } from "@/lib/uploadImage";
import { CiEdit } from "react-icons/ci";
import { FaReadme } from "react-icons/fa6";

import { CreateBlogDTO } from "@/types/blogs";
import { SubCategoryDTO } from "@/types/subCategory";
import {
  createBlogAction,
  updateBlogAction,
} from "@/modules/blogs/blog.actions";
import SwitchToggle from "../common/SwitchToggle";

/* -------------------------------------
   Types
------------------------------------- */
interface CategoryDTO {
  _id: string;
  name: string;
}

export type BlogFormMode = "create" | "view" | "edit";

interface BlogDTO extends CreateBlogDTO {
  _id: string;
}

interface Props {
  mode: BlogFormMode;
  categories: CategoryDTO[];
  subcategories: SubCategoryDTO[];
  initialData?: BlogDTO;
}

const LIMITS = {
  DESCRIPTION: 200,
  META_TITLE: 50,
  META_DESCRIPTION: 150,
};


/* -------------------------------------
   Component
------------------------------------- */
export default function BlogForm({
  mode,
  categories,
  subcategories,
  initialData,
}: Props) {
  const router = useRouter();
  const [currentMode, setCurrentMode] =
    useState<BlogFormMode>(mode);

  const isCreate = currentMode === "create";
  const isView = currentMode === "view";
  const isEdit = currentMode === "edit";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [form, setForm] = useState<CreateBlogDTO>(
    initialData
      ? {
          ...initialData,
          seo: {
            metaTitle: initialData.seo.metaTitle,
            metaDescription: initialData.seo.metaDescription,
          },
        }
      : {
          title: "",
          slug: "",
          description: "",
          richText: "",
          thumbnailImage: "",
          category: "",
          subCategory: "",
          status: "draft",
          featured: false,
          seo: {
            metaTitle: "",
            metaDescription: "",
          },
        }
  );



  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  /* -------------------------------------
     Submit (Create / Update)
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

      const payload: CreateBlogDTO = {
        ...form,
        status,
        slug: form.slug || generateSlug(form.title),
        thumbnailImage: imageUrl,
      };

      if (isCreate) await createBlogAction(payload);
      if (isEdit && initialData)
        await updateBlogAction(initialData._id, payload);

      router.push("/admin/blogs");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  /* -------------------------------------
     Validatoin Form
  ------------------------------------- */
  const validateForm = (): string | null => {
    if (!form.title.trim()) return "Title is required";

    if (!form.description.trim())
      return "Short description is required";

    if (form.description.length > LIMITS.DESCRIPTION)
      return "Description limit exceeded";

    if (!form.category) return "Category is required";
    if (!form.subCategory) return "Sub-category is required";

    if (!form.richText || form.richText === "<p></p>")
      return "Blog content is required";

    if (form.seo.metaTitle.length > LIMITS.META_TITLE)
      return "Meta title limit exceeded";

    if (form.seo.metaDescription.length > LIMITS.META_DESCRIPTION)
      return "Meta description limit exceeded";

    return null;
  };


  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* ================= Main ================= */}
      <div className="w-full lg:w-[80%]">
        <label className="text-sm text-gray-500">Title</label>
        <input
          disabled={isView}
          className="w-full border border-gray-300 rounded px-3 py-1 mb-4"
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
          value={form.richText}
          readOnly={isView}
          onChange={(v) =>
            setForm({ ...form, richText: v })
          }
        />
      </div>

      {/* ================= Sidebar ================= */}
      <div className="w-full lg:w-[20%] border-l border-b border-gray-300  rounded p-2 h-fit pb-8">
        {mode !== "create" && (
          <div className="flex justify-end mb-3">
            {isView ? (
              <button onClick={() => setCurrentMode("edit")}>
                <CiEdit size={24} />
              </button>
            ) : (
              <button
                onClick={() => {
                  setForm(initialData!);
                  setCurrentMode("view");
                }}
              >
                <FaReadme size={22} />
              </button>
            )}
          </div>
        )}

        {/* Slug */}
        <label className="text-xs text-gray-500">Slug</label>
        <input
          disabled={isView}
          className="w-full border border-gray-300 rounded px-2 py-1 mb-3"
          value={form.slug}
          onChange={(e) =>
            setForm({ ...form, slug: e.target.value })
          }
        />

        {/* Description */}
        <div>
          <label className="text-xs text-gray-500">
          Short Description
          </label>
          <textarea
            disabled={isView}
            className="w-full border border-gray-300 rounded px-2 py-1"
            value={form.description}
            onChange={(e) => {
              if (e.target.value.length <= LIMITS.DESCRIPTION) {
                setForm({ ...form, description: e.target.value });
              }
            }}
            rows={5}
          />

          <p className="flex justify-end text-xs px-1">
            {form.description.length}/{LIMITS.DESCRIPTION}
          </p>

        </div>

        {/* Category */}
        <label className="text-xs text-gray-500">Category</label>
        <select
          disabled={isView}
          className="w-full border border-gray-300 rounded px-2 py-1 mb-3"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option value="">Select</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Subcategory */}
        <label className="text-xs text-gray-500">
          Sub-Category
        </label>
        <select
          disabled={isView}
          className="w-full border border-gray-300 rounded px-2 py-1 mb-3"
          value={form.subCategory}
          onChange={(e) =>
            setForm({ ...form, subCategory: e.target.value })
          }
        >
          <option value="">Select</option>
          {subcategories.map((s) => (
            <option key={s._id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>

        <div className="bg-bg-secondary py-2 px-2 rounded">
          {/* Featured */}
          <SwitchToggle
            label="Featured Blog"
            checked={form.featured}
            onChange={(v) =>
              setForm({ ...form, featured: v })
            }
            className="mt-2"
          />
          <p className="text-xs bg-bg-secondary mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde vel corrupti eveniet delectus maxime, fugit nihil! Earum quis fuga minus.</p>
        </div>

        {/* SEO */}
        <div className="mt-4">
          <label className="text-xs">Meta Title</label>
          <textarea
            value={form.seo.metaTitle}
            onChange={(e) => {
              if (e.target.value.length <= LIMITS.META_TITLE) {
                setForm({
                  ...form,
                  seo: { ...form.seo, metaTitle: e.target.value },
                });
              }
            }}
            rows={2}
            className="border border-gray-300 w-full rounded text-xs p-2"
          />

          <p className="flex justify-end text-xs px-1">
            {form.seo.metaTitle.length}/{LIMITS.META_TITLE}
          </p>



          <label className="text-xs mt-2 block">
            Meta Description
          </label>
          <textarea
            value={form.seo.metaDescription}
            onChange={(e) => {
              if (e.target.value.length <= LIMITS.META_DESCRIPTION) {
                setForm({
                  ...form,
                  seo: {
                    ...form.seo,
                    metaDescription: e.target.value,
                  },
                });
              }
            }}
            rows={4}
            className="border border-gray-300 w-full rounded text-xs p-2"
          />

          <p className="flex justify-end text-xs px-1">
            {form.seo.metaDescription.length}/{LIMITS.META_DESCRIPTION}
          </p>


        </div>

        {!isView && (
          <ImageUpload
            label="Thumbnail"
            onChange={setThumbnail}
            wrapperClassName="mt-4"
            labelClassName="text-sm"
            previewWrapperClassName="border border-gray-300 p-4 rounded mt-2"
          />
        )}

        {form.thumbnailImage && (
          <img
            src={form.thumbnailImage}
            className="rounded border border-gray-300 mt-3"
          />
        )}

        {error && (
          <p className="text-red-500 text-xs mt-2">
            {error}
          </p>
        )}

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
      </div>
    </div>
  );
}
