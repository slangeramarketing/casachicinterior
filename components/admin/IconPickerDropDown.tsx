"use client";
import React, { useState } from 'react';
import { getInteriorIconById, INTERIOR_ICONS } from '@/public/assets/constants-icons/interior-icons';

// Props ka interface define karein
interface IconPickerProps {
  value?: string;
  onChange?: (id: string) => void;
  name?: string;
}

export default function IconPickerDropDown({ value, onChange, name }: IconPickerProps) {
  const [selectedId, setSelectedId] = useState(value || INTERIOR_ICONS[0].id);
  
  const handleChange = (id: string) => {
    setSelectedId(id);
    if (onChange) onChange(id); 
  };

  const SelectedIcon = getInteriorIconById(selectedId);

  return (
    <div className="flex items-center gap-4">
      <input type="hidden" name={name} value={selectedId} />

      <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
        <SelectedIcon size={24} />
      </div>

      <select 
        value={selectedId}
        onChange={(e) => handleChange(e.target.value)}
        className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-orange-500 w-full"
      >
        {INTERIOR_ICONS.map(item => (
          <option key={item.id} value={item.id}>{item.label}</option>
        ))}
      </select>
    </div>
  );
}