import { readBody } from "h3";
import { createTopicSchema } from "~/server/libs/validation/topic";
import { TopicOptionService } from "~/server/services/topic-option.service";
import { TopicService } from "~/server/services/topic.service";
import { spawn } from 'child_process'
import { join } from 'path'

const topicService = new TopicService();
const topicOptionService = new TopicOptionService()

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const schema = createTopicSchema();
  await schema.validate(body, { abortEarly: false });

  const { titulo, opciones = [] } = body;
  const topic = await topicService.createTopic(titulo, 1);

  for (const opcion of opciones) {
    await topicOptionService.create(opcion, topic.id);
  }

  // crear db vectorial
  const pythonPath  = join(process.cwd(), 'scripts', 'Scripts', 'python.exe')
  const scriptPath  = join(process.cwd(), 'scripts', 'crear_vector_db.py')
  const idTopic     = (topic.id).toString()

  const scriptArgs = [
    scriptPath,
    idTopic
    // "otro_parametro"
  ];

  // Ejecutar python en segundo plano (sin bloquear)
  const pyProcess = spawn(pythonPath, scriptArgs, {
    detached: true,
    stdio: 'ignore',
  })

  pyProcess.unref()

  pyProcess.on('error', (err) => {
    console.error(`Error al iniciar el script de Python: ${err.message}`);
  });
  
  return { success: true, topic };
});
