import { NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises"; 

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file received." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");
    
    const uploadDirPath = path.join(process.cwd(), "public/uploads");
    
    const filePath = path.join(uploadDirPath, filename);


    try {
        await mkdir(uploadDirPath, { recursive: true });
    } catch (err) {
    
        console.log("Folder sudah ada atau gagal dibuat:", err);
    }
    // ----------------------------------------------

    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
    });

  } catch (error) {
    console.error("Error SERVER:", error); 
    return NextResponse.json(
      { error: "Gagal mengupload file." },
      { status: 500 }
    );
  }
}