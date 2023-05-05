import type { Cobranca, Item } from "@prisma/client";

import { prisma } from "~/db.server";

export function getItem({
  id,
}: Pick<Item, "id">)
  : Promise<Item | null> {
  return prisma.item.findFirst({
    select: {
      id: true,
      status: true,
      cobrancaId: true,
      dividaId: true,
      createdAt: true,
    },
    where: { id },
  });
}

export function updateItemStatus({
  id, status
}: Pick<Item, "id"> & { status: Item["status"] })
  : Promise<Item | null> {
  return prisma.item.update({
    data: {
      status,
    },
    where: { id },
  });
}

export function getItemByCobranca({ cobrancaId }: { cobrancaId: Cobranca["id"] })
  : Promise<Item[]> {
  return prisma.item.findMany({
    where: { cobrancaId },
    select: {
      id: true,
      status: true,
      cobrancaId: true,
      dividaId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}


export function createItem({
  dividaId,
  cobrancaId,
}: Pick<Item, "dividaId"> & {
  cobrancaId: Cobranca["id"];
}) {
  return prisma.item.create({
    data: {
      divida: {
        connect: {
          id: dividaId,
        },
      },
      cobranca: {
        connect: {
          id: cobrancaId,
        },
      },
      status: "pendente",
    },
  });
}

export function deleteItem({
  id,
  cobrancaId,
}: Pick<Item, "id"> & { cobrancaId: Cobranca["id"] }) {
  return prisma.item.deleteMany({
    where: { id, cobrancaId },
  });
}
