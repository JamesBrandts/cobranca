
import type { LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getFile } from "~/models/read-file.server";



export const loader = async ({params}:LoaderArgs) => {
    invariant(params.fileName, "fileName is required");
    const fileName = params.fileName;
    const fileContent = await getFile(fileName);
    console.log({fileContent,fileName});
    return redirect("/tags/upload")
};
