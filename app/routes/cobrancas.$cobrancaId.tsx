import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import { getCobranca } from "~/models/cobranca.server";
import { getDividaPorContribuinteId } from "~/models/divida.server";


import { getContribuinte } from "~/models/contribuinte.server";

export const loader = async ({ params, request }: LoaderArgs) => {
  invariant(params.cobrancaId, "noteId not found");

  const cobranca = await getCobranca({ id: params.cobrancaId })
  if (!cobranca) {
    throw new Response("Cobrança não encontrada", { status: 404 });
  }

  if (!cobranca?.contribuinteId) {
    throw new Response("Cobrança sem Contribuinte vonculado", { status: 404 });
  }
  const contribuinte = await getContribuinte({ id: cobranca.contribuinteId })
  if (!contribuinte) {
    throw new Response("Contribuinte não encontrado", { status: 404 });
  }
  const dividas = await getDividaPorContribuinteId({ contribuinteId: contribuinte.id })
  return json({ cobranca, dividas, contribuinte });
};


export default function NoteDetailsPage() {
  const { cobranca, dividas, contribuinte } = useLoaderData<typeof loader>();
  const total = dividas.reduce((acc, divida) => acc + divida.valor, 0);
  return (
    <div>
      <div className="border p-2">
        <div className="bg-white w-28 p-2 m-2" style={{ marginTop: -28 }}>Contribuinte</div>
        <p className="py-2">ID: <Link to={`/contribuintes/${contribuinte?.id}?text=Ola!`}>{contribuinte?.id}</Link> </p>
        <h3 className="text-2xl font-bold">{contribuinte?.nome}</h3>
        <p className="py-2">Telefone:<Link target="_blank" to={`https://wa.me/55${contribuinte?.telefone}?text=Ola%20${contribuinte.nome}`} rel="noopener noreferrer"> {contribuinte?.telefone}</Link></p>
        <p className="py-2">E-mail: {contribuinte?.email}</p>
        <p className="py-2">CPF/CNPJ: {contribuinte?.cpf_cnpj}</p>
      </div>
      <p className="py-2 ">Dívida Total Cobranca: <span className="font-bold text-xl">{`R$ ${Math.floor(total / 100)},${total % 100}`}</span></p>
      <hr className="my-4" />
      <div>
        <p>Status da Cobrança: {cobranca.status}</p>
        <div className="flex gap-2 items-center">
          <Form action="./Pendente" method="post">
            <button
              type="submit"
              className={`rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-400 ${cobranca.status === "Pendente"&&"border-8 border-zinc-500"}`}
            >
              Pendente
            </button>
          </Form>
          <Form action="./Parcialmente Convertida" method="post">
            <button
              type="submit"
              className={`rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 focus:bg-orange-400 ${cobranca.status === "Parcialmente Convertida"&&"border-8 border-zinc-500"}`}
            >
              Parcialmente Convertida
            </button>
          </Form>
          <Form action="./Convertida" method="post">
            <button
              type="submit"
              className={`rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600 focus:bg-yellow-400 ${cobranca.status === "Convertida"&&"border-8 border-zinc-500"}`}
            >
              Convertida
            </button>
          </Form>
          <Form action="./Paga" method="post">
            <button
              type="submit"
              className={`rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:bg-green-400 ${cobranca.status === "Paga"&&"border-8 border-zinc-500"}`}
            >
              Paga
            </button>
          </Form>
          <Form action="./Parcelada" method="post">
            <button
              type="submit"
              className={`rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 ${cobranca.status === "Parcelada"&&"border-8 border-zinc-500"}`}
            >
              Parcelada
            </button>
          </Form>
        </div>
      </div>
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
    return <div>Cobrança não Encontrada</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
