import { TopicService } from '~/server/services/topic.service'

const topicService = new TopicService()

export default defineEventHandler(async () => {
  const topics = await topicService.getTopicsWithPaperCount()
  return topics
})