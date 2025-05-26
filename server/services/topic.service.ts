// server/services/user.service.ts
import { TopicRepository } from '../repository/topic.repository'

const topicRepository = new TopicRepository()

export class TopicService {
  async getTopics() {
    return await topicRepository.findAll()
  }

  async getTopic(id: number) {
    return await topicRepository.findById(id)
  }

  async createTopic(nombre: string, correo: string) {
    return await topicRepository.create({ nombre, correo })
  }

  async deleteTopic(id: number) {
    return await topicRepository.delete(id)
  }
}
