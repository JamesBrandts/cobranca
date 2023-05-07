import type { User } from "@prisma/client";
import { Form, Link } from "@remix-run/react"


export default function Header(props: { focus: String; user: User }) {
  const { focus, user } = props
  return (
    <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
      <h1 className={`text-xl font-bold ${focus === "cobrancas" ? " underline" : ""}`}>
        <Link to="/cobrancas">Cobranças</Link>
      </h1>
      <h1 className={`text-xl font-bold ${focus === "contribuintes" ? " underline" : ""}`}>
        <Link to="/contribuintes">Contribuintes</Link>
      </h1>
      <h1 className={`text-xl font-bold ${focus === "economias" ? " underline" : ""}`}>
        <Link to="/economias">Economias</Link>
      </h1>
      <h1 className={`text-xl font-bold ${focus === "atividades" ? " underline" : ""}`}>
        <Link to="/atividades">Atividades</Link>
      </h1>
      <div className="flex items-center text-white gap-4">
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Sair
          </button>
        </Form>
      </div>
    </header>
  )
}
