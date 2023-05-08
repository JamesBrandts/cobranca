import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { createCobranca } from "~/models/cobranca.server";
import { advancedFilter } from "~/models/divida.server";
import { createItem } from "~/models/item.server";

import { createTag, deleteTag } from "~/models/tag.server";
import { getUsersList } from "~/models/user.server";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const users = await getUsersList();
  const nome = formData.get("nome");
  const minValor = Number(formData.get("minValor"))*100 || 0;
  const maxValor = Number(formData.get("maxValor"))*100 || Number.MAX_SAFE_INTEGER;
  const tipo = formData.get("tipo");
  const exercicioMin = Number(formData.get("exercicioMin")) || 0;;
  const exercicioMax = Number(formData.get("exercicioMax")) || 9999;
  const tributo = formData.get("tributo");
  const allUserIds = users.map((user) => `${formData.get(user.id)}`);

  if (typeof nome !== "string" || nome.length === 0) {
    return json(
      { errors: { users: null, nome: "Nome da Tag é Obrigatório" } },
      { status: 400 }
    );
  }

  const userIds = allUserIds.filter((userId) => userId !== 'null');
  if (userIds.length === 0) {
    return json(
      { errors: { users: "Seleciona pelo menos um Usuário", nome: null } },
      { status: 400 }
    );
  }
  const tag = await createTag({ nome, userIds })
  let preencheuFiltro = false;
  const filtroTributo = tributo !== "todos" ? tributo : { not: '' };
  const filtroTipo = tipo !== "todos" ? tipo : { not: '' };
  const dividas = await advancedFilter({ tributo: filtroTributo, tipo: filtroTipo, exercicio: { gte: exercicioMin, lte: exercicioMax } });
  const contribuinteIds = new Set(dividas.map((divida) => divida.contribuinteId));
  contribuinteIds.forEach(async (contribuinteId) => {
    const dividasContribuinte = dividas.filter((divida) => divida.contribuinteId === contribuinteId);
    const dividasContribuinteValor = dividasContribuinte.map((divida) => divida.valor).reduce((a, b) => a + b, 0);
    if (dividasContribuinteValor < minValor || dividasContribuinteValor > maxValor) return;
    preencheuFiltro = true;
    const cobranca = await createCobranca({ contribuinteId, tagId: tag.id, userIds });
    dividasContribuinte.forEach(async (divida) => {
      await createItem({ cobrancaId: cobranca.id, dividaId: divida.id });
    });
  });

  if (preencheuFiltro) {
    await deleteTag({id:tag.id});
    return json(
      { errors: { users: "Nenhuma dívida encontrada com os filtros selecionados", nome: null } },
      { status: 400 }
    );
  }

  return redirect(`/tags/${tag.id}`);
};

export const loader = async ({ request }: LoaderArgs) => {
  const users = await getUsersList();
  return json({ users });
};

export default function NewTagPage() {
  const { users } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const nomeRef = useRef<HTMLInputElement>(null);
  const usersRef = useRef<HTMLInputElement>(null);
  const minValorRef = useRef<HTMLInputElement>(null);
  const maxValorRef = useRef<HTMLInputElement>(null);
  const tipoRef = useRef<HTMLSelectElement>(null);
  const exercicioMinRef = useRef<HTMLInputElement>(null);
  const exercicioMaxRef = useRef<HTMLInputElement>(null);
  const tributoRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (actionData?.errors?.nome) {
      nomeRef.current?.focus();
    } else if (actionData?.errors?.users) {
      usersRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div ref={usersRef} className="flex-col">
        <label className="flex p-2">Usuários: </label>
        <div className="grid grid-cols-6 gap-4">
          {users.map((user) => (
            <div className="" key={user.id}>
              <label className="flex justify-center items-center" >
                <input className="" name={user.id} value={user.id}
                  type="checkbox" /> {user.email}
              </label>
            </div>
          ))}
        </div>
        {actionData?.errors?.users ? (
          <div className="pt-1 text-red-700" id="users-error">
            {actionData.errors.users}
          </div>
        ) : null}
      </div>
      <div className="flex-1 gap-4">
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Nome da Tag: </span>
            <input
              ref={nomeRef}
              name="nome"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.nome ? true : undefined}
              aria-errormessage={
                actionData?.errors?.nome ? "nome-error" : undefined
              }
            />
          </label>
          {actionData?.errors?.nome ? (
            <div className="pt-1 text-red-700" id="nome-error">
              {actionData.errors.nome}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex gap-4">
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Valor Mínimo: </span>
            <input
              ref={minValorRef}
              name="minValor"
              type="number"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            />
          </label>
        </div>

        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Valor Máximo: </span>
            <input
              ref={maxValorRef}
              type="number"
              name="maxValor"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            />
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Exercício Mínimo: </span>
            <input
              ref={exercicioMinRef}
              name="exercicioMin"
              type="number"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            />
          </label>
        </div>
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Exercício Máximo: </span>
            <input
              ref={exercicioMaxRef}
              name="exercicioMax"
              type="number"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            />
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Tributo: </span>
            <select ref={tributoRef} name="tributo" className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose">
              <option value="todos">Todos</option>
              <option value="IPTU">IPTU</option>
              <option value="ISSV">ISSV</option>
              <option value="ISSQN">ISSQN</option>
              <option value="ISSO">ISSO</option>
              <option value="ITBI">ITBI</option>
            </select>
          </label>
        </div>

        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Tipo: </span>
            <select ref={tipoRef} name="tipo" className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose">
              <option value="todos">Todos</option>
              <option value="N">N</option>
              <option value="P">P</option>
            </select>
          </label>
        </div>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Criar Tag
        </button>
      </div>
    </Form>
  );
}
