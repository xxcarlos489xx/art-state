import { readBody } from 'h3'
import { createTopicSchema } from '~/server/libs/validation/topic' 
import { TopicService } from '~/server/services/topic.service'

const topicService = new TopicService()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const schema = createTopicSchema()
    await schema.validate(body, { abortEarly: false })

    const { titulo } = body
    const topic = await topicService.createTopic(titulo, 1)

    return { success: true, topic }
})
