import { Prisma } from '@prisma/client'
import prisma from '~/server/libs/prisma'

export class TopicOptionRepository {
  async findAll() {
    return await prisma.topicOption.findMany()
  }

  async findById(id: number) {
    return await prisma.topicOption.findUnique({ where: { id } })
  }

  async findByTopicId(topicId: number) {
    return await prisma.topicOption.findMany({
      where: { topicId },
    })
  }

  async create(data: Prisma.TopicOptionCreateInput) {
    return await prisma.topicOption.create({ data })
  }

  async delete(id: number) {
    return await prisma.topicOption.delete({ where: { id } })
  }
}
