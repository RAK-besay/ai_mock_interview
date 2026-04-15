'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logOutUser } from "@/lib/actions/auth.action";

interface UserDropdownProps {
    user: {
        id: string;
        name?: string;
        email?: string;
        imageUrl?: string;
    }
}

const UserDropdown = ({ user }: UserDropdownProps) => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logOutUser();

            router.refresh();

            router.push('/sign-in');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-10 w-10 border border-gray-700 hover:opacity-80 transition">
                    <AvatarImage src={user.imageUrl || "/user-avatar.png"} alt="User profile" />
                    <AvatarFallback className="bg-primary-200 text-dark-100 font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 bg-dark-200 border border-gray-800 text-white mt-2" align="end">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name || 'Developer'}</p>
                        <p className="text-xs leading-none text-gray-400">
                            {user.email || 'user@example.com'}
                        </p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-gray-800" />

                <DropdownMenuItem asChild className="hover:bg-dark-300 cursor-pointer">
                    <Link href="/profile" className="w-full">
                        Profile Settings
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="hover:bg-dark-300 cursor-pointer">
                    <Link href="/" className="w-full">
                        Dashboard
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-800" />

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 hover:bg-red-950/30 cursor-pointer focus:text-red-500"
                >
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;