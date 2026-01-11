"use client";

import { deleteOfficer } from "@/actions/officer-actions";
import { useState } from "react";

export default function DeleteButton({ id, name }: { id: number, name: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus "${name}"? Data ini tidak bisa dikembalikan.`);
    
    if (!confirmed) return;

    setIsDeleting(true);
    
    const result = await deleteOfficer(id);
    
    if (!result.success) {
      alert("Gagal menghapus data!");
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-slate-500 hover:text-red-400 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
    >
      {isDeleting ? (
        <span className="animate-pulse">Menghapus...</span>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          Hapus
        </>
      )}
    </button>
  );
}