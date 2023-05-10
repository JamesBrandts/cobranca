import type { Atividade, Contribuinte, Divida, Economia } from "@prisma/client";

import { prisma } from "~/db.server";

export function getDivida({ id, contribuinteId, }:
  Pick<Divida, "id"> & {
    contribuinteId: Contribuinte["id"];
  }):
  Promise<Divida | null> {
  return prisma.divida.findFirst({
    select: {
      id: true,
      contribuinteId: true,
      economiaId: true,
      atividadeId: true,
      exercicio: true,
      parcela: true,
      tipo: true,
      tributo: true,
      valor: true,
      vencimento: true,
      createdAt: true,
      updatedAt: true,
      Economia: true,
      Atividade: true,
    },
    where: {
      id,
      contribuinteId
    },
  });
}

export function getDividaPorContribuinteId({ contribuinteId }: { contribuinteId: Contribuinte["id"] })
  : Promise<Divida[]> {
  return prisma.divida.findMany({
    where: {
      contribuinteId
    },
    select: {
      id: true,
      contribuinteId: true,
      economiaId: true,
      atividadeId: true,
      exercicio: true,
      parcela: true,
      tipo: true,
      tributo: true,
      valor: true,
      vencimento: true,
      createdAt: true,
      updatedAt: true,
      Economia: true,
      Atividade: true,
    },
    orderBy: {
      updatedAt: "asc"
    },
  });
}

export function getDividaPorAtividadeId({ atividadeId }: { atividadeId: Atividade["id"] })
  : Promise<Divida[]> {
  return prisma.divida.findMany({
    where: {
      atividadeId
    },
    select: {
      id: true,
      contribuinteId: true,
      economiaId: true,
      atividadeId: true,
      exercicio: true,
      parcela: true,
      tipo: true,
      tributo: true,
      valor: true,
      vencimento: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "asc"
    },
  });
}



export function getDividaPorEconomiaId({ economiaId }: { economiaId: Economia["id"] })
  : Promise<Divida[]> {
  return prisma.divida.findMany({
    where: {
      economiaId
    },
    select: {
      id: true,
      contribuinteId: true,
      economiaId: true,
      atividadeId: true,
      exercicio: true,
      parcela: true,
      tipo: true,
      tributo: true,
      valor: true,
      vencimento: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "asc"
    },
  });
}



export function advancedFilter({ exercicio, tipo, tributo, tributoTipo, exercicioTipo, tipoTipo }:
  Pick<Divida, "exercicio" | "tipo" | "tributo"> | any):
  Promise<Divida[]> {
  return prisma.divida.findMany({
    where: {
      exercicio,
      tipo,
      tributo,
    },
    select: {
      id: true,
      contribuinteId: true,
      economiaId: true,
      atividadeId: true,
      exercicio: true,
      parcela: true,
      tipo: true,
      tributo: true,
      valor: true,
      vencimento: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      contribuinteId: "asc"
    },
  });
}

export function filter({ exercicio, tipo, tributo }:
  Pick<Divida, "exercicio" | "tipo" | "tributo"> | any):
  Promise<Divida[]> {
  return prisma.divida.findMany({
    where: {
      exercicio,
      tipo,
      tributo
    },
    select: {
      id: true,
      contribuinteId: true,
      economiaId: true,
      atividadeId: true,
      exercicio: true,
      parcela: true,
      tipo: true,
      tributo: true,
      valor: true,
      vencimento: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      contribuinteId: "asc"
    },
  });
}
