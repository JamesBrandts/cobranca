import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import Header from "~/components/Header";

import { getTagListItems } from "~/models/tag.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const tagListItems = await getTagListItems({ userId });
  return json({ tagListItems });
};

export default function TagsPage() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header user={user} focus="tags" />
      <main className="flex h-full bg-white">
        <div className="h-full w-60 border-r bg-gray-100">
          <Link to="new" className="block p-4 text-xl text-blue-500">
            + Nova Tag
          </Link>
          <hr />
          {data.tagListItems.length === 0 ? (
            <p className="p-4">Nenhuma Tag Disponível</p>
          ) : (
            <ol>
              {data.tagListItems.map((tag) => (
                <li key={tag.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? "bg-white" : "bg-gray-100"}`
                    }
                    to={tag.id}
                  >
                    📝 {tag.nome}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
