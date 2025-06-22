import type { RequestHandler } from '@builder.io/qwik-city';
import { readConfig } from '~/services/db.js';

export const onGet: RequestHandler = async ({ json }) => {
  try {
    const config = await readConfig();
    json(200, config);
  } catch (error) {
    console.error('Config okuma hatası:', error);
    json(500, { error: 'Config okunamadı' });
  }
};
