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
    const topics  = await topicRepository.findAllWithPaperCount()

    return topics.map(topic => {
      const firstSota   = Array.isArray(topic.sotas) && topic.sotas.length > 0 ? topic.sotas[0] : null;
      const hasEntropy  = firstSota ? topic.sotas[0].img_entropy : false;
      const hasSota     = firstSota ? topic.sotas[0].ruta : false;
      const papers      = topic._count.papers
      const { sotas, _count, ...rest } = topic;

      return {
        ...rest,
        hasEntropy,
        hasSota,
        papers
      };
    });
  }

  async getTopic(id: number) {
    return await topicRepository.findById(id)
  }

  async createTopic(titulo: string, userId: number) {
    const slug = slugify(titulo, { lower: true, strict: true })

    const existing = await topicRepository.findBySlug(slug, userId);
      
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

  async createPaper(file:File, idTopic:string){

  }
}
