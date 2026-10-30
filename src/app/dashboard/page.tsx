import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { LogoutButtonClient } from "@/components/LogoutButtonClient";

export default function page() {
    return (<>
        <div className="p-4">You are signed-in! <LogoutButtonClient /></div>
        <div className="p-4">
            <ChangePasswordForm />
        </div>
    </>
    )
}
