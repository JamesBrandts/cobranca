import type { Contribuinte } from "@prisma/client";

import { prisma } from "~/db.server";

export function getContribuinte({
  id,
}: Pick<Contribuinte, "id">) {
  return prisma.contribuinte.findFirst({
    select: { id: true, nome: true, cpf_cnpj: true, email: true, telefone: true, dividas: true, atividades: true, economias: true },
    where: { id },
  });
}

export function getContribuintes(){
  return prisma.contribuinte.findMany({
    select: { id: true, nome: true, cpf_cnpj: true, email: true, telefone: true, dividas: true, atividades: true, economias: true },
  });
}

// export function getContribuintesByEconomia({ userId }: { userId: User["id"] }) {
//   return prisma.contribuinte.findMany({
//     where: { userId },
//     select: { id: true, title: true },
//     orderBy: { updatedAt: "desc" },
//   });
// }

// export function createContribuinte({
//   body,
//   title,
//   userId,
// }: Pick<Contribuinte, "body" | "title"> & {
//   userId: User["id"];
// }) {
//   return prisma.contribuinte.create({
//     data: {
//       title,
//       body,
//       user: {
//         connect: {
//           id: userId,
//         },
//       },
//     },
//   });
// }

// export function deleteContribuinte({
//   id,
//   userId,
// }: Pick<Contribuinte, "id"> & { userId: User["id"] }) {
//   return prisma.contribuinte.deleteMany({
//     where: { id, userId },
//   });
// }
