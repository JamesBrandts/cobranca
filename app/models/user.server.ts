import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) : Promise<User | null>{
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) : Promise<User | null>{
  return prisma.user.findUnique({ where: { email } });
}

export async function getUsersList() : Promise<User[]>{
  return prisma.user.findMany();
}

export async function createUser(email: User["email"], password: string, isAdmin:boolean = false) : Promise<User | null>{
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      isAdmin,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) : Promise<User | null>{
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) : Promise<User | null>{
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}

export async function updateUserPassword(
  email: User["email"],
  password: Password["hash"]
) : Promise<User | null>{
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.update({
    where: { email },
    data: {
      password: {
        update: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function updateUserisAdmin(
  id: User["id"],
  isAdmin: boolean
) : Promise<User | null>{
  return prisma.user.update({
    where: { id },
    data: {
      isAdmin
    },
  });
}