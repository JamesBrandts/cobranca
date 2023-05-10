
import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react"
import { useRef } from "react";
import { createUser, getUserByEmail } from "~/models/user.server";
import { useUser } from "~/utils"

export const action = async ({ request }: ActionArgs) => {

  const formData = await request.formData();
  const userEmail = formData.get("userEmail");
  const password1 = formData.get("password1");
  const password2 = formData.get("password2");

  if (typeof userEmail !== "string" || userEmail.length === 0) {
    return json(
      {
        errors:
        {
          userEmail: "Nome de usuário é obrigatório",
          password1: null,
          password2: null
        }
      },
      { status: 400 }
    );
  }

  if (typeof password1 !== "string" || password1.length < 8) {
    return json(
      {
        errors:
        {
          userEmail: null,
          password1: "Nova senha precisa ter pelo menos 8 caracteres",
          password2: null
        }
      },
      { status: 400 }
    );
  }

  if (typeof password2 !== "string" || password2.length === 0) {
    return json(
      {
        errors:
        {
          userEmail: null,
          password1: null,
          password2: "Confirmação de senha é obrigatória"
        }
      },
      { status: 400 }
    );
  }

  if (password1 !== password2) {
    return json(
      {
        errors:
        {
          userEmail: null,
          password1: null,
          password2: "As senhas não conferem"
        }
      },
      { status: 400 }
    );
  }

  if (await getUserByEmail(userEmail)) {
    return json(
      {
        errors:
        {
          userEmail: "Nome de usuário já existe",
          password1: null,
          password2: null
        }
      },
      { status: 400 }
    );
  }

  await createUser(userEmail, password1);


  return redirect("/user-menu");
};

export default function ChangePassword() {
  const user = useUser()
  const actionData = useActionData<typeof action>();
  const userEmailRef = useRef<HTMLInputElement>(null);
  const password1Ref = useRef<HTMLInputElement>(null);
  const password2Ref = useRef<HTMLInputElement>(null);
  return (
    <div className="p-6">
      {user?.isAdmin ?
        (<Form
          method="post"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: "100%",
          }}
        >
          <div>
            <label className="flex w-full flex-col gap-1">
              <span>Usuário: </span>
              <input
                ref={userEmailRef}
                name="userEmail"
                className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                aria-invalid={actionData?.errors?.userEmail ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.userEmail ? "userEmail-error" : undefined
                }
              />
            </label>
            {actionData?.errors?.userEmail ? (
              <div className="pt-1 text-red-700" id="userEmail-error">
                {actionData.errors.userEmail}
              </div>
            ) : null}
          </div>

          <div>
            <label className="flex w-full flex-col gap-1">
              <span>Senha: </span>
              <input
                ref={password1Ref}
                type="password"
                name="password1"
                className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                aria-invalid={actionData?.errors?.password1 ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.password1 ? "password1-error" : undefined
                }
              />
            </label>
            {actionData?.errors?.password1 ? (
              <div className="pt-1 text-red-700" id="password1-error">
                {actionData.errors.password1}
              </div>
            ) : null}
          </div>

          <div>
            <label className="flex w-full flex-col gap-1">
              <span>Confirmar Senha: </span>
              <input
                ref={password2Ref}
                type="password"
                name="password2"
                className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                aria-invalid={actionData?.errors?.password2 ? true : undefined}
                aria-errormessage={
                  actionData?.errors?.password2 ? "password2-error" : undefined
                }
              />
            </label>
            {actionData?.errors?.password2 ? (
              <div className="pt-1 text-red-700" id="password2-error">
                {actionData.errors.password2}
              </div>
            ) : null}
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Criar Usuário
            </button>
          </div>
        </Form>)
        :
        (<div className="text-center">
          <h1 className="text-2xl font-bold">Acesso Negado</h1>
          <p className="text-lg">Você não tem permissão para acessar esta página</p>
        </div>)
      }
    </div>

  )
}
