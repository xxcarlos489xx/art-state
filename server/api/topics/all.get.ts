import { TopicService } from '~/server/services/topic.service'
import { spawn } from 'child_process'
import { join } from 'path'

const topicService = new TopicService()

export default defineEventHandler(async () => {
  const topics = await topicService.getTopicsWithPaperCount()
  return topics
})