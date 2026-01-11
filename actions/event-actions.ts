"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { saveFile } from "@/lib/upload"; 

export async function createEvent(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const desc = formData.get("desc") as string;
    const date = new Date(formData.get("date") as string);
    const timeStart = (formData.get("timeStart") ?? "") as string;
    const locationName = (formData.get("locationName") ?? "") as string;
    const regLink = (formData.get("regLink") ?? "") as string;

    const imageFile = formData.get("image") as File;

    let imagePath = ""; 
    if (imageFile && imageFile.size > 0) {
        const savedPath = await saveFile(imageFile, "events");
        if (savedPath) imagePath = savedPath;
    }

    await prisma.event.create({
      data: {
        title,
        category,
        description: desc,
        date: date,
        timeStart,
        locationName,
        regLink,
        poster: imagePath, 
      },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true, message: "Event & Foto berhasil disimpan!" };

  } catch (error) {
    console.error("Gagal create event:", error);
    return { success: false, message: "Gagal menyimpan event." };
  }
}

export async function deleteEvent(id: number) {
  try {
    await prisma.event.delete({ where: { id } });
    revalidatePath("/events");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Gagal hapus event:", error);
    return { success: false, error: "Gagal menghapus data." };
  }
}