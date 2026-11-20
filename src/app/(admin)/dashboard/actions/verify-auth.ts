"server only"

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const verifyLoggedInStatus = async () => {
    const session = await getSession();
    if (!session) {
        redirect("/login")
    }
    return true;
}