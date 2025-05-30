// server/services/topic.service.ts
import { Prisma } from '@prisma/client'
import { TopicRepository } from '../repository/topic.repository'

const topicRepository = new TopicRepository()

export class TopicService {
  async getTopics() {
    return await topicRepository.findAll()
  }

  async getTopic(id: number) {
    return await topicRepository.findById(id)
  }

async createTopic(titulo: string, userId: number) {
  return await topicRepository.create({
    titulo,
    user: {
      connect: { id: userId }
    }
  } as Prisma.TopicCreateInput)
}

  async deleteTopic(id: number) {
    return await topicRepository.delete(id)
  }
}
