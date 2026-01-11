"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs"; 

export async function verifyLogin(name: string, passwordInput: string) {
  try {
    const user = await prisma.officer.findFirst({
      where: { 
        name: { equals: name } 
      },
    });

    if (!user) {
      return { success: false, message: "Nama tidak ditemukan." };
    }

    let isMatch = false;

    if (user.password && user.password.length > 20) { 
         isMatch = await bcrypt.compare(passwordInput, user.password);
    } 
    else {
         if (passwordInput === user.memberId) {
            isMatch = true;
         }
         else if (user.password) {
            isMatch = await bcrypt.compare(passwordInput, user.password);
         }
    }

    if (!isMatch) {
      return { success: false, message: "Password / Member ID salah!" };
    }

    if (!user.isActive) {
      return { success: false, message: "Akun ini dinonaktifkan." };
    }

    const sessionData = {
      name: user.name,
      role: user.accessRole,
      memberId: user.memberId,
      image: user.image
    };

    (await cookies()).set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, 
      path: "/",
    });

    return { success: true, user: sessionData };

  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, message: "Terjadi kesalahan server." };
  }
}

export async function logoutAction() {
  (await cookies()).delete("session");
}

export async function changePasswordPublic(memberId: string, oldPassword: string, newPassword: string) {
  try {

    const user = await prisma.officer.findUnique({ where: { memberId } });
    if (!user) return { success: false, message: "Member ID tidak ditemukan." };

    let isMatch = false;
    
    if (user.password && user.password.length > 20) {
         isMatch = await bcrypt.compare(oldPassword, user.password);
    } 

    else {
         if (oldPassword === user.memberId) isMatch = true; 
         else if (user.password && oldPassword === user.password) isMatch = true; 
    }

    if (!isMatch) return { success: false, message: "Password lama salah!" };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.officer.update({
      where: { memberId },
      data: { password: hashedPassword }
    });

    return { success: true, message: "Password berhasil diubah! Silakan login." };

  } catch (error) {
    console.error("Change Password Error:", error);
    return { success: false, message: "Gagal mengubah password." };
  }
}  