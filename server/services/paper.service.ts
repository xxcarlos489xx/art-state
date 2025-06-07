// server/services/paper.service.ts
import slugify from 'slugify'
import { Prisma } from '@prisma/client'
import { PaperRepository } from '../repository/paper.repository'

const paperRepository = new PaperRepository()

export class PaperService {
  async getPapers() {
    return await paperRepository.findAll()
  }

  async getPaperByDoi(doi: string, userId: number) {
    return await paperRepository.findByDoi(doi, userId)
  }

  async createPaper(doi: string, titulo: string, ruta: string, userId: number, topicId:number) {
    const slug      = slugify(titulo, { lower: true, strict: true })
    const existing  = await paperRepository.findByDoi(doi, userId, topicId);
      
    if (existing){
        throw createError({
            statusCode: 409,
            statusMessage: 'Conflict',
            message: 'El paper ya está registrado'
        })
    }
    // falta mejorar
    // crear un topic_paper.service
    // con el fin de validar si ya existe el paper asignado a un topic
    return await paperRepository.create({
      doi,
      titulo,
      slug,
      ruta,
      user: {
        connect: { id: userId }
      }
    } as Prisma.PaperCreateInput, topicId)
  }

  async deletePaper(id: number) {
    return await paperRepository.delete(id)
  }
}
