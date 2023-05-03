import type { Atividade, Contribuinte, Divida, Economia } from "@prisma/client";

import { prisma } from "~/db.server";

export function getDivida({
  id,
  contribuinteId,
}: Pick<Divida, "id"> & {
  contribuinteId: Contribuinte["id"];
}) {
  return prisma.divida.findFirst({
    select: { id: true, contribuinte: true, Economia: true, exercicio: true, parcela: true, tipo: true, tributo: true, valor: true },
    where: { id, contribuinteId },
  });
}

export function getDividaPorContribuinteId({ contribuinteId }: { contribuinteId: Contribuinte["id"] }) {
  return prisma.divida.findMany({
    where: { contribuinteId },
    select: { id: true, contribuinte: true, Economia: true, Atividade:true, exercicio: true, parcela: true, tipo: true, tributo: true, valor: true },
    orderBy: { updatedAt: "asc" },
  });
}

export function getDividaPorAtividadeId({ atividadeId }: { atividadeId: Atividade["id"] }) {
  return prisma.divida.findMany({
    where: { atividadeId },
    select: { id: true, contribuinte: true, Economia: true, exercicio: true, parcela: true, tipo: true, tributo: true, valor: true },
    orderBy: { updatedAt: "asc" },
  });
}

export function getDividaPorEconomiaId({ economiaId }: { economiaId: Economia["id"] }) {
  return prisma.divida.findMany({
    where: { economiaId },
    select: { id: true, contribuinte: true, Economia: true, exercicio: true, parcela: true, tipo: true, tributo: true, valor: true },
    orderBy: { updatedAt: "asc" },
  });
}


// export function createDivida({
//   body,
//   title,
//   contribuinteId,
// }: Pick<Divida, "body" | "title"> & {
//   contribuinteId: Contribuinte["id"];
// }) {
//   return prisma.divida.create({
//     data: {
//       title,
//       body,
//       contribuinte: {
//         connect: {
//           id: contribuinteId,
//         },
//       },
//     },
//   });
// }


// export function deleteDivida({
//   id,
//   contribuinteId,
// }: Pick<Divida, "id"> & { contribuinteId: Contribuinte["id"] }) {
//   return prisma.divida.deleteMany({
//     where: { id, contribuinteId },
//   });
// }
