// server/repository/paper.repository.ts
import { Prisma } from '@prisma/client'
import  prisma  from '~/server/libs/prisma'

export class PaperRepository {
  async findAll() {
    return await prisma.paper.findMany()
  }

  async findByDoi(doi: string, userId:number, topicId:number = 0) {
    return await prisma.paper.findFirst({
      where: {
        doi,
        userId,
      },
    });
  }

  async create(data: Prisma.PaperCreateInput, topicId:number){
    const paper = await prisma.paper.create({ data })

    await prisma.topicPaper.create({
      data: {
        topic: { connect: { id: topicId } },
        paper: { connect: { id: paper.id } },
        estado: 'nuevo', // o el valor que necesites
        rutaDb: '',    // o la ruta que corresponda
      },
    });

    return paper
  }

  async delete(id: number) {
    return await prisma.paper.delete({ where: { id } })
  }
}
