import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";
import { getEconomias } from "~/models/economia.server";

import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  const economias = await getEconomias();
  return json({ economias });
};

export default function NotesPage() {
  const { economias } = useLoaderData<typeof loader>();
  const user = useUser();
  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header focus="economias" user={user} />
      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50 overflow-auto">
          {economias.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {economias.map((economia) => (
                <li key={economia.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                    }
                    to={economia.id}
                  >
                    {economia.contribuinteId}
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
