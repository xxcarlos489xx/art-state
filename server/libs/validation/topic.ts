import { yup } from '~/server/libs/yup'

export const createTopicSchema = () => yup.object({
  titulo: yup.string().required(),
})