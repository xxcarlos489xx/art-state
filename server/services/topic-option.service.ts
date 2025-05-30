import slugify from 'slugify'
import { TopicOptionRepository } from '~/server/repository/topic-option.repository'

const topicOptionRepository = new TopicOptionRepository()

export class TopicOptionService {
  async getAll() {
    return topicOptionRepository.findAll()
  }

  async getById(id: number) {
    return topicOptionRepository.findById(id)
  }

  async getByTopic(topicId: number) {
    return topicOptionRepository.findByTopicId(topicId)
  }

  async create(titulo: string, topicId: number) {
    const slug = slugify(titulo, { lower: true, strict: true })
    
    return topicOptionRepository.create({ titulo, slug, topic: { connect: { id: topicId } } })
  }

  async delete(id: number) {
    return topicOptionRepository.delete(id)
  }
}
