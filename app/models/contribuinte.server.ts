import type { Contribuinte, Divida } from "@prisma/client";

import { prisma } from "~/db.server";

export function getContribuinte({ id }: Pick<Contribuinte, "id">):
  Promise<Contribuinte | null> {
  return prisma.contribuinte.findFirst({
    select: {
      id: true,
      nome: true,
      cpf_cnpj: true,
      telefone: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
    where: { id },
  });
}

export function getContribuintes(): Promise<Contribuinte[]> {
  return prisma.contribuinte.findMany({
    select: {
      id: true,
      nome: true,
      cpf_cnpj: true,
      telefone: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

