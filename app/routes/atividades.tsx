import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import { getAtividades } from "~/models/atividade.server";

import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  const atividades = await getAtividades();
  return json({ atividades });
};

export default function NotesPage() {
  const { atividades } = useLoaderData<typeof loader>();
  const user = useUser();
  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header focus="atividades" user={user} />
      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          {atividades.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {atividades.map((atividade) => (
                <li key={atividade.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={atividade.id}
                  >
                    {atividade.contribuinteId}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
