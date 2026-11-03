import { ChangePasswordForm } from "@/components/Admin/ChangePasswordForm";
import { LogoutButtonClient } from "@/components/Admin/LogoutButtonClient";

export default function page() {
    return (<>
        <div className="p-4">You are signed-in! <LogoutButtonClient /></div>
        <div className="p-4">
            <ChangePasswordForm />
        </div>
    </>
    )
}
