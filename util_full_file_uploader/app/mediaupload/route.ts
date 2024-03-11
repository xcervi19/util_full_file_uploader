import { NextRequest, NextResponse } from 'next/server';
import { writeFile, stat, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { format } from 'date-fns';

import sanitizeFilename from 'sanitize-filename';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === 'string') {
    return new Response(JSON.stringify({ error: "File blob is required." }), { status: 400 });
  }

  console.log(file.name)
  const buffer = Buffer.from(await file.arrayBuffer());
  const pathDist = join(process.cwd(), "/public/images");
  const relativeUploadDir = format(new Date(), "dd-MM-yyyy");
  const uploadDir = join(pathDist, relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (e) {
    if (e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
    } else {
      console.error("Error creating directory:", e);
      return new Response(JSON.stringify({ error: "Something went wrong." }), { status: 500 });
    }
  }

  try {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const fileExtension = extname(file.name);
    const originalFilename = file.name.replace(/\.[^/.]+$/, "");
    const sanitizedFilename = sanitizeFilename(originalFilename);
    const filename = `${sanitizedFilename}_${uniqueSuffix}${fileExtension}`;

    await writeFile(join(uploadDir, filename), buffer);

    const finalFilePath = `http://localhost:3000/images/${relativeUploadDir}/${filename}`;
    return new Response(JSON.stringify({ message: "ok", filename, httpFilePath: finalFilePath }), { status: 200 });
  } catch (e) {
    console.error("Error uploading file:", e);
    return new Response(JSON.stringify({ error: "Something went wrong." }), { status: 500 });
  }

}
