// server/services/topic.service.ts
import slugify from 'slugify'
import { Prisma } from '@prisma/client'
import { TopicRepository } from '../repository/topic.repository'

const topicRepository = new TopicRepository()

export class TopicService {
  async getTopics() {
    return await topicRepository.findAll()
  }

  async getTopicsWithPaperCount() {
    return await topicRepository.findAllWithPaperCount()
  }

  async getTopic(id: number) {
    return await topicRepository.findById(id)
  }

async createTopic(titulo: string, userId: number) {
  const slug = slugify(titulo, { lower: true, strict: true })

  const existing = await topicRepository.findBySlug(slug);
    
  if (existing){
      throw createError({
          statusCode: 409,
          statusMessage: 'Conflict',
          message: 'El topic ya está registrado'
      })
  }

  return await topicRepository.create({
    titulo,
    slug,
    user: {
      connect: { id: userId }
    }
  } as Prisma.TopicCreateInput)
}

  async deleteTopic(id: number) {
    return await topicRepository.delete(id)
  }
}
