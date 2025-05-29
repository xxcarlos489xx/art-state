// server/services/user.service.ts
import { UserRepository } from "~/server/repository/user.repository";

const userRepository = new UserRepository();

export class UserService {
  async getUsers() {
    return userRepository.findAll();
  }

  async getUser(id: number) {
    return userRepository.findById(id);
  }

  async createUser(correo: string, pass:string) {
    const existing = await userRepository.findByEmail(correo);
    
    if (existing){
        // throw new Error("El correo ya está registrado");
        throw createError({
            statusCode: 409,
            statusMessage: 'Conflict',
            message: 'El correo ya está registrado'
        })
    } 
    
    const password = await hashPassword(pass)

    return userRepository.create({ correo, password });
  }

  async deleteUser(id: number) {
    return userRepository.delete(id);
  }

  async findByEmail(correo: string) {
    return userRepository.findByEmail(correo);
  }
}
