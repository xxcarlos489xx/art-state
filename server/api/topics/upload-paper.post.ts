// server/api/topics/upload-paper.post.ts
import { defineEventHandler } from "h3";
import { uploadPaperSchema } from "~/server/libs/validation/topic";
import { TopicService } from "~/server/services/topic.service";
import { mkdirSync, existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import { generateFileName } from "~/server/utils/file-util";
import { PaperService } from "~/server/services/paper.service";

const topicService = new TopicService();
const paperService = new PaperService();

export default defineEventHandler(async (event) => {
    const USER_ID  = 1
    const formData = await readMultipartFormData(event)

    if (!formData) {
        throw createError({
            statusCode: 400,
            message: 'No se recibió el formulario',
        })
    }

    const topicId   =   formData.find(field => field.name === 'topicId')?.data?.toString()
    const nroDoi    =   formData.find(field => field.name === 'nroDoi')?.data?.toString()
    const pdfFile   =   formData.find(field => field.name === 'pdfFile')
    const schema    =   uploadPaperSchema();

    await schema.validate({topicId, nroDoi, pdfFile}, { abortEarly: false });

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

    const exist_paper = await paperService.getPaperByDoi(nroDoi as string, USER_ID);

    if (exist_paper?.id) {
        throw createError({
            statusCode: 400,
            message: 'Paper ya registrado.',
        })
    }

    const slug = `${topic.slug}_${USER_ID}`

    const storageDir = join(process.cwd(), 'server/storage', slug)

    if (!existsSync(storageDir))    mkdirSync(storageDir, { recursive: true })

    const fileName      =   `${pdfFile.filename}` || 'uploaded.pdf'
    const encrypt_name  =   generateFileName(fileName)
    const filePath      =   join(storageDir, encrypt_name )

    writeFileSync(filePath, pdfFile.data)

    await paperService.createPaper(nroDoi as string, fileName, encrypt_name, USER_ID, topic.id)

    return {
        message: 'Paper subido correctamente',
        topicId: topic.id,
        path: filePath,
    }
});
