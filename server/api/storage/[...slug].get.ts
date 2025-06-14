// server/api/storage/[...slug].get.ts
import { defineEventHandler, getRouterParam, setResponseHeader } from 'h3';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { lookup } from 'mime-types'; // Necesitarás instalar esta librería

export default defineEventHandler((event) => {
    // 1. Obtener la parte de la ruta que identifica al archivo
    const slug = getRouterParam(event, 'slug');

    if (!slug) {
        throw createError({ statusCode: 400, message: 'Ruta de archivo no especificada.' });
    }

    // 2. Construir la ruta absoluta y segura al archivo en el disco
    // process.cwd() es la raíz del proyecto.
    // resolve() previene ataques de "directory traversal" (ej. ../../etc/passwd)
    const basePath = resolve(process.cwd(), 'server/storage');
    const filePath = join(basePath, slug);

    // 3. Verificar que el archivo realmente existe
    if (!existsSync(filePath)) {
        throw createError({ statusCode: 404, message: 'Archivo no encontrado.' });
    }

    // 4. Leer el contenido del archivo
    try {
        const fileContent = readFileSync(filePath);

        // 5. Determinar el tipo de contenido (MIME type)
        // Esto es crucial para que el navegador sepa si es una imagen, un PDF, etc.
        const mimeType = lookup(filePath) || 'application/octet-stream';
        setResponseHeader(event, 'Content-Type', mimeType);

        // 6. Devolver el contenido del archivo como la respuesta
        return fileContent;

    } catch (error) {
        console.error(`Error al leer el archivo: ${filePath}`, error);
        throw createError({ statusCode: 500, message: 'No se pudo leer el archivo.' });
    }
});