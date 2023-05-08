import type { User, Cobranca, Tag } from "@prisma/client";

import { prisma } from "~/db.server";

export function getCobranca({
  id }: Pick<Cobranca, "id">):
  Promise<Cobranca | null> {
  return prisma.cobranca.findFirst({
    select: { id: true, itens: true, contribuinte: true, contribuinteId: true, status: true, createdAt: true, users: true, tag: true, tagId: true },
    where: { id },
  });
}

export function getCobrancaListByUser({ userId }: { userId: User["id"] })
  : Promise<Cobranca[]> {
  return prisma.cobranca.findMany({
    where: { users: { some: { id: userId } } },
    select: { id: true, itens: true, contribuinte: true, contribuinteId: true, status: true, createdAt: true, users: true, tag: true, tagId: true },
    orderBy: { createdAt: "asc" },
  });
}

export function getCobrancaListByUserAndStatus({ userId, status }: { userId: User["id"], status: Cobranca["status"] })
  : Promise<Cobranca[]> {
  return prisma.cobranca.findMany({
    where: { users: { some: { id: userId } }, status },
    select: { id: true, itens: true, contribuinte: true, contribuinteId: true, status: true, createdAt: true, users: true, tag: true, tagId: true },
    orderBy: { createdAt: "asc" },
  });
}

export function updateCobrancaStatus({
  id, status
}: Pick<Cobranca, "id"> & { status: Cobranca["status"] })
  : Promise<Cobranca | null> {
  return prisma.cobranca.update({
    data: {
      status,
    },
    where: { id },
  });
}


export function createCobranca({
  contribuinteId,
  userId,
  tagId,
}: Pick<Cobranca, "contribuinteId"> & {
  userId: User["id"];
}& {
  tagId: Tag["id"];
}) {
  return prisma.cobranca.create({
    data: {
      contribuinte: {
        connect: {
          id: contribuinteId,
        }
      },
      tag: {
        connect: {
          id: tagId,
        }
      },
      status: "Pendente",
      users: {
        connect: {
          id: userId,
        },
      },
    }
  });
}

export function deleteCobranca({
  id
}: Pick<Cobranca, "id">) {
  return prisma.cobranca.deleteMany({
    where: { id },
  });
}
