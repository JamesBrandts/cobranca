import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Header from "~/components/Header";
import { getCobrancaListByUserAndStatus } from "~/models/cobranca.server";
import { requireUserId } from "~/session.server";

import { useUser } from "~/utils";

export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await requireUserId(request);
  invariant(params.cobrancaStatus, "cobrancaStatus is required")
  const cobrancas = await getCobrancaListByUserAndStatus({ userId, status: params.cobrancaStatus });
  return json({ cobrancas });
};

export default function NotesPage() {
  const { cobrancas }: { cobrancas: any[] } = useLoaderData<typeof loader>();
  const user = useUser();
  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header focus="cobrancas" user={user} />
      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50 overflow-auto">
          {cobrancas.length === 0 ? (
            <p className="p-4">Nenhuma cobrança encontrada</p>
          ) : (
            <ol>
              {cobrancas.map((cobranca) => (
                <li key={cobranca.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={cobranca.id}
                  >
                    <span className={
                      cobranca.status === "Pendente" ? "text-red-500 text-3xl" :
                        cobranca.status === "Parcialmente Convertida" ? "text-orange-500 text-3xl" :
                          cobranca.status === "Convertida" ? "text-yellow-500 text-3xl" :
                            cobranca.status === "Paga" ? "text-green-500 text-3xl" :
                              cobranca.status === "Parcelada" ? "text-blue-500 text-3xl" :
                                "text-black-500 text-3xl"}
                    >●</span> {cobranca.contribuinte.nome}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
