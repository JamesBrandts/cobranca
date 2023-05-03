import type { Atividade } from "@prisma/client";

import { prisma } from "~/db.server";

export function getAtividade({
  id,
}: Pick<Atividade, "id">) {
  return prisma.atividade.findFirst({
    select: { id: true, dividas: true, contribuinte: true },
    where: { id },
  });
}

export function getAtividades(){
  return prisma.atividade.findMany({
    select: { id: true, dividas: true, contribuinte: true },
  });
}
