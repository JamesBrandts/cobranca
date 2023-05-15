import type { Atividade } from "@prisma/client";

import { prisma } from "~/db.server";

export function getAtividade({
  id,
}: Pick<Atividade, "id">) : Promise<Atividade | null>{
  return prisma.atividade.findFirst({
    select: { id: true, dividas: true, contribuinte: true, contribuinteId: true },
    where: { id },
  });
}

export function getAtividades(): Promise<Atividade[]>{
  return prisma.atividade.findMany({
    select: { id: true, dividas: true, contribuinte: true, contribuinteId: true },
  });
}

export function createAtividade({id, contribuinteId}: any): Promise<Atividade>{
  return prisma.atividade.create({
    data: { id, contribuinteId },
  });
}