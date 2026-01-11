"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { saveFile } from "@/lib/upload"; 

export async function createGallery(formData: FormData) {
  try {

    const caption = formData.get("caption") as string;
    const tag = formData.get("tag") as string;
    const author = formData.get("author") as string || "Admin";

    const imageFile = formData.get("image") as File;
    let imagePath = "";

    if (imageFile && imageFile.size > 0) {
        const savedPath = await saveFile(imageFile, "gallery");
        if (savedPath) imagePath = savedPath;
    }

    await prisma.gallery.create({
      data: {
        caption,
        tag,
        author,
        image: imagePath || "/placeholder-gallery.jpg", 
        date: new Date()
      }
    });

    revalidatePath("/admin");
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery"); 
    
    return { success: true };
  } catch (error) {
    console.error("Gagal upload gallery:", error);
    return { success: false, error: "Database error" };
  }
}

export async function deleteGallery(id: number) {
  try {
    await prisma.gallery.delete({ where: { id } });
    revalidatePath("/gallery");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Gagal hapus gallery:", error);
    return { success: false, error: "Gagal menghapus data." };
  }
}