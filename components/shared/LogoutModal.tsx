"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { logOutUser } from "@/lib/actions/auth.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LogoutModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const LogoutModal = ({ isOpen, setIsOpen }: LogoutModalProps) => {
    const router = useRouter();

    const handleLogout = async () => {
        const toastId = toast.loading("Logging out...");
        const res = await logOutUser();

        if (res?.success) {
            toast.success("Logged out successfully", { id: toastId });
            setIsOpen(false);
            router.push("/sign-in");
        } else {
            toast.error("Failed to log out", { id: toastId });
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className="bg-dark-200 border border-gray-800 text-white sm:max-w-[425px]">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl">Are you sure to log out?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                        You will need to sign in again to access your account and mock interviews.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel className="bg-transparent border-gray-700 text-white hover:bg-dark-300 hover:text-white">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleLogout}
                        className="bg-red-600 text-white hover:bg-red-700 border-none"
                    >
                        Log out
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};