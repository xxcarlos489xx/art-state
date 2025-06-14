// server/services/sota.service.ts
import { SotaRepository } from '~/server/repository/sota.repository'

const sotaRepository = new SotaRepository()

export class SotaService {
  async getTopic(idTopic: number) {
    return await sotaRepository.findByTopic(idTopic)
  } 
}
