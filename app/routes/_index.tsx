import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";


export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative sm:pb-16 sm:pt-8">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase text-slate-800 drop-shadow-md">
                  PMSL
                </span>
                <span className="block uppercase text-slate-800 drop-shadow-md text-4xl sm:text-6xl lg:text-7xl">
                  Dívida Ativa
                </span>
              </h1>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                  <Link
                    to="/login"
                    className="flex items-center justify-center rounded-md bg-slate-800 px-4 py-3 font-medium text-white hover:bg-slate-600 text-3xl uppercase"
                  >
                    Entrar
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
