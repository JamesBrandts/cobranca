import type { Economia } from "@prisma/client";

import { prisma } from "~/db.server";

export function getEconomia({
  id,
}: Pick<Economia, "id">): Promise<Economia | null> {
  return prisma.economia.findFirst({
    select: { id: true, dividas: true, contribuinte: true, contribuinteId: true, },
    where: { id },
  });
}

export function getEconomias(): Promise<Economia[]> {
  return prisma.economia.findMany({
    select: { id: true, dividas: true, contribuinte: true, contribuinteId: true },
  });
}

export function createEconomia({id, contribuinteId}: any): Promise<Economia> {
  return prisma.economia.create({
    data: { id, contribuinteId },
  });
}