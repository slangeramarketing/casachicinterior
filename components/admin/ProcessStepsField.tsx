"use client";

import { useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import {
  IconPackKey,
  resolveIcon,
} from "@/lib/utils/iconRegistry";
import IconPicker from "../common/IconPicker";

/* =====================================================
   Types
===================================================== */
export interface ProcessStepInput {
  title: string;
  description: string;
  icon?: string; // e.g. "fi:FiEdit3"
}

interface ProcessStepsFieldProps {
  label: string;
  value: ProcessStepInput[];
  onChange: (steps: ProcessStepInput[]) => void;

  labelClassName?: string;
  wrapperClassName?: string;
}

/* =====================================================
   Component
===================================================== */
export default function ProcessStepsField({
  label,
  value,
  onChange,
  labelClassName = "",
  wrapperClassName = "",
}: ProcessStepsFieldProps) {
  const [draft, setDraft] = useState<ProcessStepInput>({
    title: "",
    description: "",
    icon: "",
  });

  /* -----------------------
     Add Step
  ----------------------- */
  function addStep() {
    if (!draft.title.trim() || !draft.description.trim())
      return;

    onChange([...value, draft]);
    setDraft({ title: "", description: "", icon: "" });
  }

  /* -----------------------
     Remove Step
  ----------------------- */
  function removeStep(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  /* -----------------------
     Reorder
  ----------------------- */
  function move(index: number, dir: "up" | "down") {
    const copy = [...value];
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= copy.length) return;

    [copy[index], copy[target]] = [
      copy[target],
      copy[index],
    ];
    onChange(copy);
  }

  return (
    <div className={`flex flex-col gap-4 ${wrapperClassName}`}>
      {/* LABEL */}
      <label
        className={`text-sm font-medium text-gray-700 ${labelClassName}`}
      >
        {label}
      </label>

      {/* EXISTING STEPS */}
      {value.length > 0 && (
        <div className="space-y-3">
          {value.map((step, index) => {
            const Icon =
              step.icon &&
              (() => {
                const [pack, name] =
                  step.icon.split(":") as [
                    IconPackKey,
                    string
                  ];
                return resolveIcon(pack, name);
              })();

            return (
              <div
                key={index}
                className="flex gap-3 items-start border border-gray-300 rounded-md p-3 bg-gray-50"
              >
                {/* ORDER */}
                <div className="flex flex-col items-center gap-1 text-xs text-gray-500 pt-1">
                  <span className="font-semibold">
                    {index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => move(index, "up")}
                    disabled={index === 0}
                    className="disabled:opacity-30"
                  >
                    <FiArrowUp />
                  </button>

                  <button
                    type="button"
                    onClick={() => move(index, "down")}
                    disabled={index === value.length - 1}
                    className="disabled:opacity-30"
                  >
                    <FiArrowDown />
                  </button>
                </div>

                {/* ICON */}
                {Icon && (
                  <div className="pt-1 text-bg-primary">
                    <Icon size={18} />
                  </div>
                )}

                {/* CONTENT */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {step.description}
                  </p>
                </div>

                {/* REMOVE */}
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD NEW STEP */}
      <div className="border border-gray-300 rounded-md p-4 bg-white space-y-3">
        <input
          type="text"
          placeholder="Step title (e.g. Consultation)"
          value={draft.title}
          onChange={(e) =>
            setDraft({
              ...draft,
              title: e.target.value,
            })
          }
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />

        <textarea
          placeholder="Brief description of this step"
          value={draft.description}
          onChange={(e) =>
            setDraft({
              ...draft,
              description: e.target.value,
            })
          }
          rows={2}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none"
        />

        {/* ICON PICKER */}
        <IconPicker
          value={draft.icon || ""}
          onChange={(icon) =>
            setDraft({ ...draft, icon })
          }
        />

        <button
          type="button"
          onClick={addStep}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm
                     bg-bg-primary text-white rounded hover:opacity-90"
        >
          <FiPlus />
          Add Step
        </button>
      </div>
    </div>
  );
}
