import type { User, Tag } from "@prisma/client";

import { prisma } from "~/db.server";

export function getTag({
  id,
}: Pick<Tag, "id">): Promise<Tag | null> {
  return prisma.tag.findFirst({
    select: { id: true, nome: true, createdAt: true, updatedAt: true, cobrancas: true },
    where: { id },
  });
}

export function getTagListItems({ userId }: { userId: User["id"] }) {
  return prisma.tag.findMany({
    where: { users: { some: { id: userId } } },
    select: { id: true, nome: true, createdAt: true, updatedAt: true, cobrancas: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createTag({
  nome,
  userIds
}: Pick<Tag, "nome"> & { userIds: User["id"][] }) {
  return prisma.tag.create({
    data: {
      nome,
      users: {
        connect: userIds.map((id) => ({ id })),
      },
    },
  });
}

export function deleteTag({
  id,
}: Pick<Tag, "id">) {
  return prisma.tag.deleteMany({
    where: { id },
  });
}
