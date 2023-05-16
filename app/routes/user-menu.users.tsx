import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react"
import { getUsersList } from "~/models/user.server";
import { useUser } from "~/utils"

export const loader = async ({ request }: LoaderArgs) => {
  const users = await getUsersList();
  return json({ users });
};


export default function UserMenu() {
  const user = useUser()
  const { users } = useLoaderData<typeof loader>();
  return (
    <div>
      {user.isAdmin ?
        <div className="inline-flex h-full">
          <div className="h-full w-60 border-r bg-gray-100">
            <ol className="w-60 overflow-auto h-full">
              {users.map((user) => (
                <li key={user.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : "bg-gray-100"}`
                    }
                    to={user.id}
                  >
                    {user.email}
                  </NavLink>
                </li>
              ))}
            </ol>
          </div>
          <div className="p-6">
            <Outlet />
          </div>
        </div>
        :
        <div className="text-center p-6">
          <h1 className="text-2xl font-bold">Acesso Negado</h1>
          <p className="text-lg">Você não tem permissão para acessar esta página</p>
        </div>
      }
    </div>
  )
}
