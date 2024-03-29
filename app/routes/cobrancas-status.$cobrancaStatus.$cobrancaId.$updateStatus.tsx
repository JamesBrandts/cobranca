import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { updateCobrancaStatus } from "~/models/cobranca.server";



export const action = async ({ request, params }: ActionArgs) => {
    invariant(params.cobrancaId, "noteId not found");
    invariant(params.updateStatus, "noteId not found");
    await updateCobrancaStatus({ id: params.cobrancaId, status: params.updateStatus })
    return redirect("..");
};

export const loader = async () => redirect("..");
