import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { getContribuinte } from "~/models/contribuinte.server";
import { getDividaPorContribuinteId } from "~/models/divida.server";

import { deleteNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.contribuinteId, "noteId not found");

  const contribuinte = await getContribuinte({ id: params.contribuinteId })
  if (!contribuinte) {
    throw new Response("Not Found", { status: 404 });
  }

  const dividas = await getDividaPorContribuinteId({ contribuinteId: params.contribuinteId })
  return json({ contribuinte, dividas });
};

export const action = async ({ params, request }: ActionArgs) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  await deleteNote({ id: params.noteId, userId });

  return redirect("/notes");
};

export default function NoteDetailsPage() {
  const { contribuinte, dividas } = useLoaderData<typeof loader>();
  const total = dividas.reduce((acc, divida) => acc + divida.valor, 0);
  return (
    <div>
      <p className="py-2">ID: {contribuinte.id}</p>
      <h3>Nome: <span className="text-xl font-bold">{contribuinte.nome}</span></h3>
      <p className="py-2">Telefone: {contribuinte.telefone}</p>
      <p className="py-2">E-mail: {contribuinte.email}</p>
      <p className="py-2">CPF/CNPJ: {contribuinte.cpf_cnpj}</p>
      <p className="py-2 ">Dívida Total Contribuinte: <span className="font-bold text-xl">{`R$ ${Math.floor(total / 100)},${total % 100}`}</span></p>
      <hr className="my-4" />
      {dividas.length === 0 ? (
        <p className="p-2">Nenhuma Dívida a ser Exibida</p>
      ) : (
        <table className="table-auto border-collapse border border-slate-500">
          <tr>
            <th className="p-2 border border-slate-600">Tipo</th>
            <th className="p-2 border border-slate-600">Tributo</th>
            <th className="p-2 border border-slate-600">Exercício</th>
            <th className="p-2 border border-slate-600">Parcela</th>
            <th className="p-2 border border-slate-600">Valor</th>
            <th className="p-2 border border-slate-600">Economia</th>
            <th className="p-2 border border-slate-600">Atividade</th>
          </tr>
          {dividas.map((divida) => (
            <tr key={divida.id}>
              <td className="p-2 border border-slate-600">{divida.tipo}</td>
              <td className="p-2 border border-slate-600">{divida.tributo}</td>
              <td className="p-2 border border-slate-600">{divida.exercicio}</td>
              <td className="p-2 border border-slate-600">{divida.parcela}</td>
              <td className="p-2 border border-slate-600">{`R$ ${Math.floor(divida.valor / 100)},${divida.valor % 100}`}</td>
              <td className="p-2 border border-slate-600"><Link to={`/economias/${divida.economiaId}`}>{divida.economiaId}</Link></td>
              <td className="p-2 border border-slate-600"><Link to={`/atividades/${divida.atividadeId}`}>{divida.atividadeId}</Link></td>
            </tr>
          ))}
        </table>)}
      <hr className="my-4" />
      {/* <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form> */}
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
