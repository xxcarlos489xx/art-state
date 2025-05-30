// server/repository/topic.repository.ts
import { Prisma } from '@prisma/client'
import  prisma  from '~/server/libs/prisma'

export class TopicRepository {
  async findAll() {
    return await prisma.topic.findMany()
  }

  async findById(id: number) {
    return await prisma.topic.findUnique({ where: { id } })
  }

  async create(data: Prisma.TopicCreateInput){
    return await prisma.topic.create({ data })
  }

  async delete(id: number) {
    return await prisma.topic.delete({ where: { id } })
  }

  async findBySlug(slug: string, id:number = 0) {
    if (id != 0)  return prisma.topic.findFirst({ where: { slug, id } });
    else          return prisma.topic.findFirst({ where: { slug } });    
  }

  async findAllWithPaperCount() {
    return await prisma.topic.findMany({
      include: {
        _count: {
          select: { papers: true }
        },
        sotas: {
          take: 1,
          orderBy: {
            id: 'desc'
          }
        }
      }
    })
  }
}
