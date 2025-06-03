// server/api/topics/upload-paper.post.ts
import { defineEventHandler } from "h3";
import { uploadPaperSchema } from "~/server/libs/validation/topic";
import { TopicService } from "~/server/services/topic.service";
import { mkdirSync, existsSync, writeFileSync } from 'fs'
import { join } from 'path'

const topicService = new TopicService();


export default defineEventHandler(async (event) => {
    const formData = await readMultipartFormData(event)

    if (!formData) {
        throw createError({
            statusCode: 400,
            message: 'No se recibió el formulario',
        })
    }

    const topicId   = formData.find(field => field.name === 'topicId')?.data?.toString()
    const pdfFile   = formData.find(field => field.name === 'pdfFile')
    const schema    = uploadPaperSchema();

    await schema.validate({topicId, pdfFile}, { abortEarly: false });

    if (pdfFile?.type !== 'application/pdf') {
        throw createError({
            statusCode: 400,
            message: 'El archivo debe ser un PDF válido',
        })
    }

    const topic = await topicService.getTopic(parseInt(topicId as string));

    if (!topic?.id) {
        throw createError({
            statusCode: 400,
            message: 'Topic no existe',
        })
    }

    const slug = topic.slug

    const storageDir = join(process.cwd(), 'server/storage', slug)

    if (!existsSync(storageDir))    mkdirSync(storageDir, { recursive: true })
    
    const filePath = join(storageDir, pdfFile.filename || 'uploaded.pdf')
    writeFileSync(filePath, pdfFile.data)

    return {
        message: 'Archivo subido correctamente',
        topicId: topic.id,
        path: filePath,
    }
});
