import type { ActionFunction, LoaderArgs} from "@remix-run/node";
import { unstable_createMemoryUploadHandler } from "@remix-run/node";
import { unstable_composeUploadHandlers } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { unstable_createFileUploadHandler, unstable_parseMultipartFormData, } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useRef } from "react";
import { createCobranca } from "~/models/cobranca.server";
import { createContribuinte, getContribuinte } from "~/models/contribuinte.server";
import { createDivida } from "~/models/divida.server";
import { createEconomia, getEconomia } from "~/models/economia.server";
import { createItem } from "~/models/item.server";
import { getFile } from "~/models/read-file.server";
import { createTag } from "~/models/tag.server";
import { getUsersList } from "~/models/user.server";


const fileUploadHandler = unstable_composeUploadHandlers(
  unstable_createFileUploadHandler({
    directory: './public/uploads',
    file: ({ filename }) => filename,
  }),
  unstable_createMemoryUploadHandler()
)

export const action: ActionFunction = async ({ request }) => {
  const formData: FormData = await unstable_parseMultipartFormData(request, fileUploadHandler);
  const fileInfo: FormDataEntryValue | null | any = formData.get('upload');
  const users = await getUsersList();
  const allUserIds = users.map((user) => `${formData.get(user.id)}`);
  const userIds = allUserIds.filter((userId) => userId !== 'null');
  const nome = formData.get('nome');
  if (userIds.length === 0) {
    return json(
      { errors: { file: null, users: "Seleciona pelo menos um Usuário", nome: null } },
      { status: 400 }
    );
  }
  if (typeof nome !== "string" || nome.length === 0) {
    return json(
      { errors: { file: null, nome: "Nome da Tag é Obrigatório", users: null } },
      { status: 400 }
    );
  }
  if (!fileInfo) {
    return json(
      { errors: { file: "Arquivo é Obrigatório", nome: null, users: null } },
      { status: 400 }
    );
  }
  if (!fileInfo?.name) {
    return json(
      { errors: { file: "Arquivo não encontrado", nome: null, users: null } },
      { status: 400 }
    );
  }
  const fileContents = await getFile(fileInfo?.name);
  if (!fileContents || fileContents === null) {
    return json(
      { errors: { file: "Arquivo não foi lido corretamente", nome: null, users: null } },
      { status: 400 }
    );
  }
  const tag = await createTag({ nome, userIds, });
  const table = fileContents.split("\n").map((line: string) => line.split("\t"));
  let cobranca: any | null;

  table.map(async (line: string[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [economiaId, exercicio, CDIMPOSTO, tributo, parcela, tipo, STPARCELAMENTO, BASEDECALCULO, TPPESSOA, contribuinteId, DSSTIMPOSTO, createdAt, NR_PARCELAMENTO, DATA_PARCELAMENTO, NRPROCESSO_JUDICIAL, DATA_ENTRADA, vencimento, MNEIMPOSTO, valor] = line;
    let contribuinte = await getContribuinte({ id: contribuinteId });    
    let economia = await getEconomia({ id: economiaId });
    if (!contribuinte) {
      contribuinte = await createContribuinte({
        id: contribuinteId,
        nome: "",
        cpf_cnpj: "",
        telefone: "",
        email: "",
      });
    }
    if (!economia) {
      economia = await createEconomia({
        id: economiaId, contribuinteId: contribuinteId ?? contribuinte?.id

      });
    }
    if (!cobranca || cobranca?.contribuinteId !== contribuinteId)
      cobranca = await createCobranca({ contribuinteId:contribuinteId??contribuinte.id, userIds, tagId: tag.id })

    const divida = await createDivida({ contribuinteId, economiaId, exercicio: Number(exercicio), parcela: Number(parcela), tipo, tributo, valor: Number(valor.replace("\r","").replace(",","")), vencimento: new Date(vencimento), createdAt: new Date(createdAt) })
    await createItem({ dividaId: divida.id, cobrancaId: cobranca?.id })

  });
  return redirect(".");
};

export const loader = async ({ request }: LoaderArgs) => {
  const users = await getUsersList();
  return json({ users });
};

export default function Upload() {
  const { users } = useLoaderData<typeof loader>();
  const nomeRef = useRef<HTMLInputElement>(null);
  const actionData = useActionData<typeof action>();
  const usersRef = useRef<HTMLInputElement>(null);

  return (
    <Form method="post" encType="multipart/form-data" className="p-6 flex flex-col gap-4">
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
      <div>
        <input type="file" name="upload"
          className="
                text-grey-500
                file:mr-5 file:py-2 file:px-6
                file:rounded file:border-0
                file:w-40             
                file:bg-blue-500 file:text-white
                hover:file:cursor-pointer hover:file:bg-blue-600
                hover:file:text-white
                file:focus:outline-blue-500
                file:focus:bg-blue-400
              "
          aria-invalid={actionData?.errors?.file ? true : undefined}
          aria-errormessage={
            actionData?.errors?.file ? "file-error" : undefined
          }
        />
        {actionData?.errors?.file ? (
          <div className="pt-1 text-red-700" id="file-error">
            {actionData.errors.file}
          </div>
        ) : null}
      </div>
      <button type="submit"
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 w-40">
        Enviar</button>
    </Form>
  );
};

