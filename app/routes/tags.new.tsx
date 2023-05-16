import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { createCobranca } from "~/models/cobranca.server";
import { filtroContribuintes } from "~/models/contribuinte.server";
import { createManyItems } from "~/models/item.server";

import { createTag } from "~/models/tag.server";
import { getUsersList } from "~/models/user.server";
import { getUser } from "~/session.server";

export const action = async ({ request }: ActionArgs) => {
  const user = await getUser(request);
  invariant(user?.isAdmin, "Acesso Negado");
  const formData = await request.formData();
  const users = await getUsersList();
  const nome = formData.get("nome");
  const minValor = Number(formData.get("minValor")) * 100 || 0;
  const maxValor = Number(formData.get("maxValor")) * 100 || Number.MAX_SAFE_INTEGER;
  const tipo = formData.get("tipo");
  const exercicioMin = Number(formData.get("exercicioMin")) || 0;;
  const exercicioMax = Number(formData.get("exercicioMax")) || 9999;
  const tributo = formData.get("tributo");
  const allUserIds = users.map((user) => `${formData.get(user.id)}`);
  const exercicioTipo = formData.get("exercicioTipo");
  const tipoTipo = formData.get("tipoTipo");
  const tributoTipo = formData.get("tributoTipo");
  const userIds = allUserIds.filter((userId) => userId !== 'null');
  if (typeof nome !== "string" || nome.length === 0) {
    return json(
      { errors: { users: null, nome: "Nome da Tag é Obrigatório" } },
      { status: 400 }
    );
  }

  
  if (userIds.length === 0) {
    return json(
      { errors: { users: "Seleciona pelo menos um Usuário", nome: null } },
      { status: 400 }
    );
  }

  const where = {
    dividas: {
      some: {
        exercicio: { gte: exercicioMin, lte: exercicioMax },
        tributo: tributo !== "todos" ? tributo : {},
        tipo: tipo !== "todos" ? tipo : {},
      },
      every: {
        exercicio: exercicioTipo === "Exclusivo" ? { gte: exercicioMin, lte: exercicioMax } : {},
        tributo: tributo !== "todos" && tributoTipo === "Exclusivo" ? tributo : {},
        tipo: tipo !== "todos" && tipoTipo === "Exclusivo" ? tipo : {},
      }
    }
  }
  let contribuintes = await filtroContribuintes({ where });
  if (exercicioTipo === "Selecionar") {
    contribuintes.map((contribuinte) =>
      contribuinte.dividas = contribuinte.dividas.filter((divida) => divida.exercicio >= exercicioMin && divida.exercicio <= exercicioMax))
  }
  if (tipoTipo === "Selecionar" && tipo !== "todos") {
    contribuintes.map((contribuinte) =>
      contribuinte.dividas = contribuinte.dividas.filter((divida) => divida.tipo === tipo))
  }
  if (tributoTipo === "Selecionar" && tributo !== "todos") {
    contribuintes.map((contribuinte) =>
      contribuinte.dividas = contribuinte.dividas.filter((divida) => divida.tributo === tributo))
  }

  contribuintes = contribuintes.filter((contribuinte) => contribuinte.dividas.reduce((sum, divida) => sum + divida.valor, 0) >= minValor && contribuinte.dividas.reduce((sum, divida) => sum + divida.valor, 0) <= maxValor)


  if (contribuintes.length === 0) {
    return json(
      { errors: { users: "Nenhum Contribuinte encontrado", nome: null } },
      { status: 400 }
    );
  }
  const tag = await createTag({ nome, userIds, })

  contribuintes.forEach(async (contribuinte) => {
    const cobranca = await createCobranca({
      contribuinteId: contribuinte.id,
      tagId: tag.id,
      userIds
    })
    await createManyItems({
      items: contribuinte.dividas.map((divida) => ({
        dividaId: divida.id,
        cobrancaId: cobranca.id,
        status: "pendente",
      }))
    })
  })
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
      className="p-6"
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
        {/* <div className="flex-col flex">
          <label><input type="radio" name="valorTipo" value="Exclusivo" /> Exclusivo</label>
          <label><input type="radio" name="valorTipo" value="Selecionar" defaultChecked /> Selecionar</label>
          <label><input type="radio" name="valorTipo" value="Conter" /> Conter</label>
        </div> */}
      </div>

      <div className="flex gap-4 pt-2">
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
        <div className="flex-col flex">
          <label><input type="radio" name="exercicioTipo" value="Exclusivo" /> Exclusivo</label>
          <label><input type="radio" name="exercicioTipo" value="Selecionar" defaultChecked /> Selecionar</label>
          <label><input type="radio" name="exercicioTipo" value="Conter" /> Conter</label>
        </div>
      </div>
      <div className="flex gap-8">
        <div className="flex gap-4 pt-4">
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
          <div className="flex-col flex">
            <label><input type="radio" name="tributoTipo" value="Exclusivo" /> Exclusivo</label>
            <label><input type="radio" name="tributoTipo" value="Selecionar" defaultChecked /> Selecionar</label>
            <label><input type="radio" name="tributoTipo" value="Conter" /> Conter</label>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
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
          <div className="flex-col flex">
            <label><input type="radio" name="tipoTipo" value="Exclusivo" /> Exclusivo</label>
            <label><input type="radio" name="tipoTipo" value="Selecionar" defaultChecked /> Selecionar</label>
            <label><input type="radio" name="tipoTipo" value="Conter" /> Conter</label>
          </div>
        </div>
      </div>
      <div className="pt-4">
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
