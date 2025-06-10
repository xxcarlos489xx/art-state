// server/api/topics/generate-sota.post.ts
import { readBody } from "h3";
import { generateSotaSchema } from "~/server/libs/validation/topic";
import { TopicService } from "~/server/services/topic.service";
import { spawn } from "child_process";
import { join } from "path";
import fs from 'node:fs';

const topicService = new TopicService();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const schema = generateSotaSchema();
    await schema.validate(body, { abortEarly: false });

    const { topicId } = body;
    const topic = await topicService.getTopic(topicId);

    if (!topic?.id || !topic.titulo || !topic.slug) {
        throw createError({
            statusCode: 400,
            message: "Topic no existe o le faltan datos (nombre, slug)",
        });
    }

    const USER_ID       =   '1';
    const slug          =   `${topic.slug}_${USER_ID}`;
    const storageDir    =   join(process.cwd(), 'server', 'storage', slug);
    fs.mkdirSync(storageDir, { recursive: true });

    const pythonPath  = join(process.cwd(), 'scripts', 'Scripts', 'python.exe')
    const scriptPath  = join(process.cwd(), 'scripts', 'consulta_vector_db.py')
    const idTopic     = (topic.id).toString()
    const tema        = topic.titulo

    const scriptArgs = [
        scriptPath,
        idTopic,
        tema,
        storageDir
    ];

    // Ejecutar python en segundo plano (sin bloquear)
    const pyProcess = spawn(pythonPath, scriptArgs, {
        detached: true,
        stdio: 'ignore',
    })
    
    pyProcess.unref()

    return {    statusCode: 200,
                success:true,
                message:"El sota estara disponible en unos momentos."
                // topic
            };
});
