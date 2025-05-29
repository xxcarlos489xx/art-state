import { yup } from '~/server/libs/yup'

export const createUserSchema = () => yup.object({
  correo: yup.string().required().email(),
  password: yup.string().min(8).required()
})