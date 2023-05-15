import { ActionFunction, json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { unstable_createFileUploadHandler, unstable_parseMultipartFormData, } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useRef } from "react";
import { getFile } from "~/models/read-file.server";


export const fileUploadHandler = unstable_createFileUploadHandler({
    directory: './public/uploads',
    file: ({ filename }) => filename,
});

export const action: ActionFunction = async ({ request }) => {
    const formData: FormData = await unstable_parseMultipartFormData(request, fileUploadHandler);
    const fileInfo: FormDataEntryValue | null | any = formData.get('upload');
    const nome = formData.get('nome');   
    if (typeof nome !== "string" || nome.length === 0) {
        return json(
          { errors: { file: null, nome: "Nome da Tag é Obrigatório" } },
          { status: 400 }
        );
      }
    if (!fileInfo) {
        return json(
            { errors: { file: "Arquivo é Obrigatório", nome: null } },
            { status: 400 }
        );
    }
    if(!fileInfo?.name){
        return json(
            { errors: { file: "Arquivo não encontrado", nome: null } },
            { status: 400 }
        );
    }
    const fileContents = await getFile(fileInfo?.name);
    if(!fileContents || fileContents === null){
        return json(
            { errors: { file: "Arquivo não foi lido corretamente", nome: null } },
            { status: 400 }
        );
    }
    const table = fileContents.split("\n").map((line: string) => line.split("\t"));
    table.map((line: string[]) => {
        const [IDENTIFICACAO, EXERCICIO, CDIMPOSTO, DSIMPOSTO, NRPARCELA, TPIMPOSTO, STPARCELAMENTO, BASEDECALCULO, TPPESSOA, INSCRICAO, DSSTIMPOSTO, DTINSCRICAO, NR_PARCELAMENTO, DATA_PARCELAMENTO, NRPROCESSO_JUDICIAL, DATA_ENTRADA, DTVENCIMENTO, MNEIMPOSTO, DIVIDA
        ] = line;
    });

    return redirect(".");
};

export default function Upload() {
    const nomeRef = useRef<HTMLInputElement>(null);
    const actionData = useActionData<typeof action>();
    return (
        <Form method="post" encType="multipart/form-data" className="p-6 flex flex-col gap-4">
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
      <div></div>
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
            />
            <button type="submit"
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 w-40">
                Enviar</button>
        </Form>
    );
};

