import type { Economia } from "@prisma/client";

import { prisma } from "~/db.server";

export function getEconomia({
  id,
}: Pick<Economia, "id">) {
  return prisma.economia.findFirst({
    select: { id: true, dividas: true, contribuinte: true },
    where: { id },
  });
}

export function getEconomias(){
  return prisma.economia.findMany({
    select: { id: true, dividas: true, contribuinte: true },
  });
}
