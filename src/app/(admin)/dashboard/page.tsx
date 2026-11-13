import { ChangePasswordForm } from "@/components/Admin/ChangePasswordForm";
import { LogoutButtonClient } from "@/components/Admin/LogoutButtonClient";
import Link from "next/link";


export default function page() {
    return (<>
        <div className="p-4">You are signed-in! <LogoutButtonClient /></div>
        <div className="p-4">
            <ChangePasswordForm />
        </div>
        <div className="p-4">
            <Link href="dashboard/new-art" className="px-4 py-2 rounded-xl bg-blue-700 text-white">
                Upload new artwork
            </Link>            
        </div>
    </>
    )
}
