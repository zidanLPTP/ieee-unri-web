"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createNews(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;
    
    const imagePath = formData.get("image") as string;
    
    await prisma.news.create({
      data: {
        title,
        content,
        author,
        image: imagePath || "", 
        date: new Date(),
        category: "Update"
      },
    });

    revalidatePath("/news");
    return { success: true };
  } catch (error) {
    console.error("Gagal create news:", error);
    return { success: false, error: "Gagal" };
  }
}

export async function deleteNews(id: number) {
  try {
    await prisma.news.delete({ where: { id } });
    revalidatePath("/news");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Gagal hapus news:", error);
    return { success: false, error: "Gagal menghapus data." };
  }
}