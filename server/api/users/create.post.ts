import { readBody } from 'h3'
import { createUserSchema } from '~/server/libs/validation/user'
import { UserService } from '~/server/services/user.service'

const userService = new UserService()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const schema = createUserSchema()
    await schema.validate(body, { abortEarly: false })

    const { correo, password } = body
    const pass = await hashPassword(password)
    const user = await userService.createUser(correo, pass)

    return { success: true, user }
})
