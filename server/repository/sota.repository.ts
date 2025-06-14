// server/repository/paper.repository.ts
import { Prisma } from '@prisma/client'
import  prisma  from '~/server/libs/prisma'

export class SotaRepository {
  async findAll() {
    return await prisma.sota.findMany()
  }

  async findByTopic(topicId: number) {
    return await prisma.sota.findFirst({
      where: {
        topicId
      },
    });
  }
}
