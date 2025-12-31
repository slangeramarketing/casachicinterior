"use client";

import { useEffect, useRef, useState } from "react";
import { FiImage, FiPlus, FiTrash2 } from "react-icons/fi";

import MultiImageUpload from "@/components/common/MultiImageUpload";
import SwitchToggle from "@/components/common/SwitchToggle";
import { useSlugify } from "@/lib/utils/useSlugify";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import ImageUpload from "@/components/common/ImageUpload";
import * as FiIcons from "react-icons/fi";

import { createServiceAction } from "@/modules/services/service.action";
import IconPicker from "@/components/common/IconPicker";

/* -------------------------------------
   TYPES (LOCAL UI STATE)
------------------------------------- */




interface IncludeItem {
  image: File | null;
  title: string;
}


interface ProcessStep {
  icon: string;      // 👈 react-icon name (string)
  step: number;
  title: string;
  description: string;
}


const TITLE_LIMIT = 100;
const SHORT_DESC_LIMIT = 200;


/* -------------------------------------
   COMPONENT
------------------------------------- */
export default function ServiceCreateForm() {
  const { slugify } = useSlugify();

  const messageRef = useRef<HTMLDivElement | null>(null);


  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);



  const [shortDescription, setShortDescription] = useState("");
  const [overview, setOverview] = useState("");

  const [featured, setFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [includes, setIncludes] = useState<IncludeItem[]>([]);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  /* -------------------------------------
     HANDLERS
  ------------------------------------- */
  function handleTitleChange(value: string) {
  const trimmedValue = value.slice(0, TITLE_LIMIT);
  setTitle(trimmedValue);
  setSlug(slugify(trimmedValue));
}


  function addInclude() {
    setIncludes([...includes, { image: null, title: "" }]);
  }


  function removeInclude(index: number) {
    setIncludes(includes.filter((_, i) => i !== index));
  }

    function addProcessStep() {
    setProcessSteps([
        ...processSteps,
        {
        icon: "FiInfo",
        step: processSteps.length + 1,
        title: "",
        description: "",
        },
    ]);
    }


  function removeProcessStep(index: number) {
    setProcessSteps(processSteps.filter((_, i) => i !== index));
  }


async function handleSubmit() {
  setError(null);
  setSuccess(null);
  setLoading(true);

  try {
    if (!coverImage) {
      throw new Error("Cover image is required");
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("shortDescription", shortDescription);
    formData.append("overview", overview);
    formData.append("featured", String(featured));
    formData.append("coverImage", coverImage);

    galleryImages.forEach((file) =>
      formData.append("galleryImages", file)
    );

   // Includes (TEXT only)
    formData.append(
    "includes",
    JSON.stringify(
        includes.map((i) => ({
        title: i.title,
        }))
    )
    );

    // Includes images (FILES separately)
    includes.forEach((i, index) => {
    if (i.image) {
        formData.append(`includeImages`, i.image);
    }
    });


    // Process steps (TEXT only)
    formData.append(
    "processSteps",
    JSON.stringify(
        processSteps.map((p) => ({
        step: p.step,
        icon: p.icon,
        title: p.title,
        description: p.description,
        }))
    )
    );



    await createServiceAction(formData);

    setSuccess("Service created successfully");
  } catch (err: any) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
}


useEffect(() => {
  if (error || success) {
    messageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}, [error, success]);




  /* -------------------------------------
     UI
  ------------------------------------- */
  return (
    <div className="w-full mb-32 flex flex-col">

    <div className="p-4">
       <PageRouteHeader/> 
       <PageTitle title="Service" description="This Page for Creating New Services what casa chic interior can deliver." titleClassName="!text-3xl pb-2" />
    </div>
    <div
        ref={messageRef}
        className="w-full p-4 px-6 text-wrap"
        >
        {error && (
            <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded">
            {error}
            </div>
        )}

        {success && (
            <div className="bg-green-50 border border-green-300 text-green-600 px-4 py-2 rounded">
            {success}
            </div>
        )}
    </div>


      {/* ================= BASIC INFO ================= */}
      <div className="bg-white rounded p-6 space-y-6">

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Service Title
            </label>
           <div className="relative">
            <input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="mt-2 w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Residential Interior Design"
            />

            <span
                className={`absolute right-2 bottom-1 text-xs ${
                title.length === TITLE_LIMIT
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
            >
                {title.length} / {TITLE_LIMIT}
            </span>
            </div>

          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Slug (auto-generated)
            </label>
            <input
              value={slug}
              readOnly
              className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 bg-bg-secondary text-gray-500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Short Description
          </label>
          <div className="relative">
        <textarea
            value={shortDescription}
            onChange={(e) =>
            setShortDescription(
                e.target.value.slice(0, SHORT_DESC_LIMIT)
            )
            }
            rows={2}
            className="mt-2 w-full border border-gray-300 rounded px-3 py-2 resize-none"
        />

        <span
            className={`absolute right-2 bottom-2 text-xs ${
            shortDescription.length === SHORT_DESC_LIMIT
                ? "text-red-500"
                : "text-gray-400"
            }`}
        >
            {shortDescription.length} / {SHORT_DESC_LIMIT}
        </span>
        </div>

        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Overview
          </label>
          <textarea
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2"
            rows={4}
          />
        </div>
      </div>

      {/* ================= COVER IMAGE ================= */}
      <div className="w-full px-6">
        <div className="bg-white rounded border border-gray-300 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Cover Image
            </h2>

            <ImageUpload
                label="Service Cover Image"
                onChange={(file) => setCoverImage(file)}
                labelClassName="block text-sm font-medium text-gray-600 mb-2"
                inputWrapperClassName="flex items-center gap-4"
                previewWrapperClassName="mt-4"
                previewImageClassName="w-40 h-28 object-cover"
                id="Service-Cover-Image"
            />
        </div>
      </div>


      {/* ================= GALLERY ================= */}
      <div className="bg-white rounded p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FiImage /> Service Gallery
        </h2>

        <MultiImageUpload
            label="Service Gallery Images"
            onChange={(files) => setGalleryImages(files)}
            labelClassName="block text-sm font-medium text-gray-600 mb-2"
            previewGridClassName="mt-4"
        />

      </div>

      {/* ================= INCLUDES ================= */}
      <div className="bg-white rounded p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            What This Service Includes
          </h2>
          <button
            type="button"
            onClick={addInclude}
            className="flex items-center gap-2 text-sm text-orange-600"
          >
            <FiPlus /> Add Item
          </button>
        </div>

        {includes.map((item, index) => (
        <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border border-gray-300 rounded p-4"
        >
            {/* Image Upload */}
            <ImageUpload
            label="Include Image"
            onChange={(file) => {
                const updated = [...includes];
                updated[index].image = file;
                setIncludes(updated);
            }}
            previewImageClassName="w-20 h-20 object-cover"
            id={`include-image-${index}`}
            />

            {/* Title */}
            <input
            value={item.title}
            onChange={(e) => {
                const updated = [...includes];
                updated[index].title = e.target.value;
                setIncludes(updated);
            }}
            placeholder="Title"
            className="border border-gray-300 rounded px-3 py-2"
            />

            {/* Remove */}
            <button
            type="button"
            onClick={() => removeInclude(index)}
            className="text-red-500 self-start mt-6"
            >
            <FiTrash2 />
            </button>
        </div>
        ))}

      </div>

      {/* ================= PROCESS STEPS ================= */}
      <div className="bg-white rounded p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Design Process
          </h2>
          <button
            type="button"
            onClick={addProcessStep}
            className="flex items-center gap-2 text-sm text-orange-600"
          >
            <FiPlus /> Add Step
          </button>
        </div>

        {processSteps.map((step, index) => (
        <div
            key={index}
            className="border border-gray-300 rounded p-4 space-y-4"
        >
            <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
                Step {step.step}
            </span>

            <button
                type="button"
                onClick={() => removeProcessStep(index)}
                className="text-red-500"
            >
                <FiTrash2 />
            </button>
            </div>

        {/* ICON SELECT */}
        <div>
        <label className="text-sm font-medium text-gray-600">
            Step Icon
        </label>

            <IconPicker
            value={step.icon}
            onChange={(iconName) => {
                const updated = [...processSteps];
                updated[index].icon = iconName;
                setProcessSteps(updated);
            }}
            />

        </div>


            {/* TITLE */}
            <input
            value={step.title}
            onChange={(e) => {
                const updated = [...processSteps];
                updated[index].title = e.target.value;
                setProcessSteps(updated);
            }}
            placeholder="Step Title"
            className="border border-gray-300 rounded px-3 py-2 w-full"
            />

            {/* DESCRIPTION */}
            <textarea
            value={step.description}
            onChange={(e) => {
                const updated = [...processSteps];
                updated[index].description = e.target.value;
                setProcessSteps(updated);
            }}
            rows={2}
            placeholder="Step Description"
            className="border border-gray-300 rounded px-3 py-2 w-full resize-none"
            />
        </div>
        ))}

      </div>

      {/* ================= SETTINGS ================= */}
      <div className="bg-white rounded p-6 flex gap-10">
        <SwitchToggle
          checked={featured}
          onChange={setFeatured}
          label="Featured Service"
        />

        <SwitchToggle
          checked={isActive}
          onChange={setIsActive}
          label="Active"
        />
      </div>

      {/* ================= ACTION ================= */}
      <div className="flex justify-end gap-4 px-4 lg:px-6 mt-8">
        <button className="px-6 py-2 bg-orange-500 text-white rounded-md" onClick={handleSubmit}>
          Create Service
        </button>
      </div>
    </div>
  );
}
