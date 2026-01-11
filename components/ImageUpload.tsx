"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void; 
  defaultImage?: string; 
}

export default function ImageUpload({ onUploadSuccess, defaultImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setPreview(data.url); 
        onUploadSuccess(data.url);
      } else {
        alert("Gagal upload gambar!");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center p-4 border-2 border-dashed border-gray-300 rounded-lg">

      {preview ? (
        <div className="relative w-40 h-40 rounded-full overflow-hidden border">
          <Image 
            src={preview} 
            alt="Preview" 
            fill 
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          <span>No Image</span>
        </div>
      )}

      <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        {loading ? "Uploading..." : "Pilih Foto"}
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange} 
          disabled={loading}
        />
      </label>
      <p className="text-xs text-gray-500">Maksimal 2MB (JPG/PNG)</p>
    </div>
  );
}