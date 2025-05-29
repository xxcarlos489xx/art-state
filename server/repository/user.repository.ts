// server/repository/user.repository.ts
import prisma from "~/server/libs/prisma";
import type { Prisma } from "@prisma/client";

export class UserRepository {
  async findAll() {
    return prisma.user.findMany();
  }

  async findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  async delete(id: number) {
    return prisma.user.delete({ where: { id } });
  }

  async findByEmail(correo: string) {
    return prisma.user.findUnique({ where: { correo } });
  }
}
