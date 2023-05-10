import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react"
import invariant from "tiny-invariant";
import { ac } from "vitest/dist/types-e3c9754d";
import { getUserById, updateUserPassword, updateUserisAdmin, } from "~/models/user.server";
import { getUser } from "~/session.server";
import { useUser } from "~/utils"

export const loader = async ({ request, params }: LoaderArgs) => {
  const localUser = await getUser(request)
  invariant(localUser?.isAdmin, "Acesso Negado");
  invariant(params.userId, "Usuário não encontrado");
  const user = await getUserById(params.userId);
  return json({ user });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const action = formData.get("action");
  invariant(action, "Ação não encontrada");
  const userId = formData.get("userId");
  invariant(typeof userId === "string", "Usuário não encontrado");
  const user = await getUserById(userId);
  invariant(user, "Usuário não encontrado");
  if (action === "reset-password") {
    await updateUserPassword(user?.email, "123456");
    return json({ message: `Senha do usuário ${user.email} resetada para 123456` }, { status: 200 });
  }
  if (action === "turn-admin") {
    await updateUserisAdmin(userId, true);
    return json({ message: `Usuário ${user.email} agora é administrador` }, { status: 200 });
  }
  if (action === "remove-admin") {
    await updateUserisAdmin(userId, false);
    return json({ message: `Usuário ${user.email} não é mais administrador` }, { status: 200 });
  }

  return redirect(".");
}


export default function UserMenu() {
  const localUser = useUser();
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  return (
    <div>
      {localUser?.isAdmin ?
        <div className="flex">
          <div className="flex flex-col gap-6">
            <p className="text-lg">Usuário: </p>
            <p className="text-xl">{user?.email}</p>
            <p className="text-lg"> </p>
            <Form method="post">
              <input type="hidden" name="action" value="reset-password" />
              <input type="hidden" name="userId" value={user?.id} />
              <button
                type="submit"
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 w-40"
              >
                Resetar Senha
              </button>
            </Form>
            {user?.isAdmin ? localUser?.id !== user?.id &&
              <Form method="post">
                <input type="hidden" name="action" value="remove-admin" />
                <input type="hidden" name="userId" value={user?.id} />
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 w-40"
                >
                  Remover Admin
                </button>
              </Form>
              :
              <Form method="post">
                <input type="hidden" name="action" value="turn-admin" />
                <input type="hidden" name="userId" value={user?.id} />
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400 w-40"
                >
                  Tornar Admin
                </button>
              </Form>}
          </div>
        </div>
        :
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold">Acesso Negado</h1>
          <p className="text-lg">Você não tem permissão para acessar esta página</p>
        </div>
      }
      {actionData?.message &&
        <p className="text-xl text-blue-700 pt-6">{actionData?.message}</p>
      }
    </div>
  )
}
