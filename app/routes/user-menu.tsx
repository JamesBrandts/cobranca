import { NavLink, Outlet } from "@remix-run/react"
import Header from "~/components/Header"
import { useUser } from "~/utils"

export default function UserMenu() {
  const user = useUser()
  return (
    <div>
      <Header user={user} focus="" />
      <div className="inline-flex h-full">
        <div className="h-full w-60 border-r bg-gray-100">
          <NavLink to="password"
            className={({ isActive }) =>
              `block border-b p-4 text-xl ${isActive ? "bg-white" : "bg-gray-100"}`}
          >Mudar Senha</NavLink>
          {user?.isAdmin &&
            <NavLink to="new"
              className={({ isActive }) =>
                `block border-b p-4 text-xl ${isActive ? "bg-white" : "bg-gray-100"}`}
            >Criar usuário</NavLink>
          }
          {user?.isAdmin &&
            <NavLink to="users"
              className={({ isActive }) =>
                `block border-b p-4 text-xl ${isActive ? "bg-white" : "bg-gray-100"}`}
            >Usuários</NavLink>
          }
          <NavLink to="/logout"
            className={({ isActive }) =>
              `block border-b p-4 text-xl ${isActive ? "bg-white" : "bg-gray-100"}`}
          >Sair</NavLink>

        </div>
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
