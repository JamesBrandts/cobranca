import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  NavLink,
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { getCobrancaListByTag } from "~/models/cobranca.server";



export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.tagId, "noteId not found");

  const cobrancas = await getCobrancaListByTag({ tagId: params.tagId });
  return json({ cobrancas });
};


export default function NoteDetailsPage() {
  const { cobrancas }: { cobrancas: any[] } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full">
      <ol className="w-60 overflow-auto h-full">
        {cobrancas.map((cobranca) => (
          <li key={cobranca.id}>
            <NavLink
              className={({ isActive }) =>
                `block border-b p-4 text-xl ${isActive ? "bg-white" : "bg-gray-100"}`
              }
              to={`${cobranca.id}`}
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
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
