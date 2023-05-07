import type { User } from "@prisma/client";
import { Form, Link } from "@remix-run/react"


export default function Header(props: { focus: String; user: User }) {
  const { focus, user } = props
  return (
    <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
      <div id="cobrancas" className={`text-xl font-bold ${focus === "cobrancas" ? " underline" : ""}`}>
        <Link to="/cobrancas">Cobranças</Link>
        <div id="cobrancas-menu" className="absolute bg-slate-800 flex flex-col p-2 gap-2 rounded-md">
          <div><Link to="/cobrancas-status/Pendente"><span className="text-red-500 text-3xl">●</span> Pendentes</Link></div>
          <div><Link to="/cobrancas-status/Parcialmente Convertida"><span className="text-orange-500 text-3xl">●</span> Parcialmente Convertidas</Link></div>
          <div><Link to="/cobrancas-status/Convertida"><span className="text-yellow-500 text-3xl">●</span> Convertidas</Link></div>
          <div><Link to="/cobrancas-status/Paga"><span className="text-green-500 text-3xl">●</span> Pagas</Link></div>
          <div><Link to="/cobrancas-status/Parcelada"><span className="text-blue-500 text-3xl">●</span> Parceladas</Link></div>
        </div>
      </div>
      <div className={`text-xl font-bold ${focus === "contribuintes" ? " underline" : ""}`}>
        <Link to="/contribuintes">Contribuintes</Link>
      </div>
      <div className={`text-xl font-bold ${focus === "economias" ? " underline" : ""}`}>
        <Link to="/economias">Economias</Link>
      </div>
      <div className={`text-xl font-bold ${focus === "atividades" ? " underline" : ""}`}>
        <Link to="/atividades">Atividades</Link>
      </div>
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
