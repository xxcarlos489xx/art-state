// server/repository/topic.repository.ts
import  prisma  from '../plugins/prisma'

export class TopicRepository {
  async findAll() {
    return await prisma.topic.findMany()
  }

  async findById(id: number) {
    return await prisma.topic.findUnique({ where: { id } })
  }

//   async create(data: { nombre: string; correo: string }) {
//     return await prisma.topic.create({ data })
//   }

  async delete(id: number) {
    return await prisma.topic.delete({ where: { id } })
  }
}
