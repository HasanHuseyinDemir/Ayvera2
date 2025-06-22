import type { RequestEvent } from '@builder.io/qwik-city';

export const onPost = async ({ request }: RequestEvent) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return new Response(JSON.stringify({ error: 'Dosya bulunamadı' }), { status: 400 });
    }
    // Node.js File API
    // @ts-ignore
    const buffer = Buffer.from(await file.arrayBuffer());
    const fs = await import('node:fs');
    const path = await import('node:path');
    // Dosya uzantısına göre klasör belirle
    const ext = path.extname(file.name).toLowerCase();
    let subfolder = '';
    if (ext === '.pdf') subfolder = 'pdf';
    else if (['.exe', '.zip', '.rar', '.7z', '.tar', '.gz', '.msi'].includes(ext)) subfolder = 'drivers';
    else subfolder = '';
    const uploadDir = subfolder
      ? path.join(process.cwd(), 'public', 'files', subfolder)
      : path.join(process.cwd(), 'public', 'files');
    await fs.promises.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, file.name);
    await fs.promises.writeFile(filePath, buffer);
    const url = subfolder ? `/files/${subfolder}/${file.name}` : `/files/${file.name}`;
    return new Response(JSON.stringify({ success: true, url }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
