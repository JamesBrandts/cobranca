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
      <div className={`text-xl font-bold ${focus === "tags" ? " underline" : ""}`}>
        <Link to="/tags">Tags</Link>
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
      <div className="flex items-center">
                <div className="user-name items-center">
                    <p className="text-center">{user.email}</p>
                    <div className="user-form w-16 sm:w-24 bg-slate-800 rounded-md">
                        <div className="flex flex-col gap-2 p-1 sm:p-4 items-center">
                            <Form action="/user-menu" method="get">
                                <button
                                    title="Menu"
                                    type="submit"
                                    className="rounded bg-slate-600 px-2 sm:px-4 py-1 w-20 hover:bg-slate-500 active:bg-slate-600"
                                >
                                  Menu                                    
                                </button>
                            </Form>
                            <Form action="/logout" method="post">
                                <button
                                title="Sair"
                                    type="submit"
                                    className="rounded bg-slate-600 px-2 sm:px-4 py-1 w-20 hover:bg-slate-500 active:bg-slate-600"
                                >
                                    Sair
                                </button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
    </header>
  )
}
