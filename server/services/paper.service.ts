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
    const existing  = await paperRepository.findByDoi(doi, userId);
      
    if (existing){
        throw createError({
            statusCode: 409,
            statusMessage: 'Conflict',
            message: 'El paper ya está registrado'
        })
    }
    
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
