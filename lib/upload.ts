import fs from "node:fs/promises";
import path from "node:path";

export async function saveFile(file: File, folder: string): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
  const fileName = `${timestamp}-${safeName}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);

  return `/uploads/${folder}/${fileName}`;
}