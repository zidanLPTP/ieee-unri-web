"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { saveFile } from "@/lib/upload";
import { Role } from "@prisma/client"; // <--- 1. WAJIB IMPORT INI

const SINGLE_ROLES = [
  "Director",
  "Vice Director I",
  "Vice Director II",
  "Vice Director III",
  "Advisor",
  "Counselor"
];

// --- CREATE OFFICER ---
export async function createOfficer(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const memberId = formData.get("memberId") as string;
    const position = formData.get("position") as string;
    const division = formData.get("division") as string;
    
    // 2. CASTING KE TIPE ROLE DISINI
    // Kita paksa string dari form menjadi tipe 'Role'
    const rawRole = formData.get("accessRole") as string;
    const accessRole: Role = (rawRole as Role) || "STAFF"; 
    
    const imageFile = formData.get("image") as File;

    if (!name || !memberId || !position || !division) {
       return { success: false, error: "Mohon lengkapi data wajib." };
    }

    // Validasi Member ID
    const existingUser = await prisma.officer.findUnique({
      where: { memberId: memberId }
    });
    if (existingUser) {
        return { success: false, error: "Member ID sudah terdaftar." };
    }

    // Validasi Single Roles
    if (SINGLE_ROLES.includes(position)) {
        const existingRole = await prisma.officer.findFirst({
            where: { 
                position: position,
                isActive: true 
            }
        });
        if (existingRole) {
            return { success: false, error: `Posisi ${position} sudah terisi oleh ${existingRole.name}.` };
        }
    }

    // Validasi Head
    if (position === "Head of Division") {
        const existingHead = await prisma.officer.findFirst({
            where: { 
                position: "Head of Division", 
                division: division,
                isActive: true
            }
        });
        if (existingHead) {
            return { success: false, error: `Divisi ${division} sudah memiliki Head (${existingHead.name}).` };
        }
    }

    // Simpan File
    let imagePath = null;
    if (imageFile && imageFile.size > 0) {
        const savedPath = await saveFile(imageFile, "officers");
        if (savedPath) imagePath = savedPath;
    }

    // Simpan ke DB
    const hashedPassword = await bcrypt.hash(memberId || "defaultPassword", 10);
    
    await prisma.officer.create({
      data: {
        name,
        memberId,
        password: hashedPassword,
        position,
        division,
        accessRole: accessRole, // <--- Sekarang ini sudah aman (Tipe Role)
        image: imagePath, 
        order: 100,
      }
    });

    revalidatePath("/admin/pengurus");
    return { success: true };

  } catch (error) {
    console.error("Gagal tambah pengurus:", error);
    return { success: false, error: "Database error." };
  }
}

// ... (Fungsi deleteOfficer dan getOfficers biarkan tetap sama) ...
export async function deleteOfficer(id: number) {
  try {
    const officer = await prisma.officer.findUnique({
      where: { id },
    });

    if (!officer) {
      return { success: false, error: "Data tidak ditemukan" };
    }

    await prisma.officer.delete({
      where: { id },
    });

    if (officer.image && !officer.image.includes("placeholder")) {
      if (officer.image.startsWith("/uploads/")) {
         try {
            const filePath = path.join(process.cwd(), "public", officer.image);
            await unlink(filePath);
         } catch (e) {
            console.error("Gagal menghapus file gambar:", e);
         }
      }
    }

    revalidatePath("/admin/pengurus");
    return { success: true };

  } catch (error) {
    console.error("Gagal menghapus:", error);
    return { success: false, error: "Gagal menghapus data" };
  }
}

export async function getOfficers(page: number = 1, query: string = "") {
  try {
    const itemsPerPage = 10;
    const skip = (page - 1) * itemsPerPage;

    const whereCondition = {
      name: {
        contains: query
      }
    };

    const totalItems = await prisma.officer.count({
      where: whereCondition,
    });

    const officers = await prisma.officer.findMany({
      where: whereCondition,
      skip: skip,
      take: itemsPerPage,
      orderBy: { order: "asc" },
    });

    return {
      success: true,
      data: officers,
      metadata: {
        totalItems,
        totalPages: Math.ceil(totalItems / itemsPerPage),
        currentPage: page
      }
    };

  } catch (error) {
    console.error("Gagal ambil data pengurus:", error);
    return { success: false, error: "Gagal memuat data." };
  }
}