import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createTag } from "~/models/tag.server";
import { getUsersList } from "~/models/user.server";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const users = await getUsersList();
  const nome = formData.get("nome");
  const minValor = formData.get("minValor");
  const maxValor = formData.get("maxValor");
  const tipo = formData.get("tipo");
  const exercicio = formData.get("exercicio");
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
  const tag = await createTag({ nome, userIds });
  const filtroTributo = tributo ? tributo : "";
  
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
  const exercicioRef = useRef<HTMLInputElement>(null);
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
      <div ref={usersRef} className="flex flex-col gap-2">
        <label className="flex w-full flex-col gap-1">Usuários: </label>
        {users.map((user) => (
          <label key={user.id}>
            <input name={user.id} value={user.id}
              type="checkbox" /> {user.email}
          </label>
        ))}
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
              aria-invalid={actionData?.errors?.nome ? true : undefined}
              aria-errormessage={
                actionData?.errors?.nome ? "nome-error" : undefined
              }
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
              aria-invalid={actionData?.errors?.nome ? true : undefined}
              aria-errormessage={
                actionData?.errors?.nome ? "nome-error" : undefined
              }
            />
          </label>
        </div>
      </div>

      <div className="flex gap-4">
        <div>
          <label className="flex w-full flex-col gap-1">
            <span>Exercício: </span>
            <input
              ref={exercicioRef}
              name="exercicio"
              type="number"
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={actionData?.errors?.nome ? true : undefined}
              aria-errormessage={
                actionData?.errors?.nome ? "nome-error" : undefined
              }
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
          Save
        </button>
      </div>
    </Form>
  );
}
