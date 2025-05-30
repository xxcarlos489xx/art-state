import { readBody } from "h3";
import { createTopicSchema } from "~/server/libs/validation/topic";
import { TopicOptionService } from "~/server/services/topic-option.service";
import { TopicService } from "~/server/services/topic.service";

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
  
  return { success: true, topic };
});
