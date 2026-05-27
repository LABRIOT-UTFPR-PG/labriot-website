import { NextResponse } from 'next/server';
import { writeFile, mkdir, appendFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get('file') as File | null;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No file provided or file is a string' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    const originalName = typeof file.name === 'string' ? file.name : 'upload.jpg';
    const filename = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const path = join(uploadDir, filename);

    await writeFile(path, buffer);

    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    try {
      await appendFile(join(process.cwd(), 'upload-error.log'), `${new Date().toISOString()}: ${error.stack || error.message}\n`);
    } catch (e) {}
    return NextResponse.json({ success: false, error: error.message || 'Error uploading file' }, { status: 500 });
  }
}
