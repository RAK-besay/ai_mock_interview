'use client';

import { useState } from "react";
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
import { LogoutModal } from "@/components/shared/LogoutModal";

interface UserDropdownProps {
    user: {
        id: string;
        name?: string;
        email?: string;
        imageUrl?: string;
    }
}

const UserDropdown = ({ user }: UserDropdownProps) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    return (
        <>
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
                        onSelect={() => setShowLogoutModal(true)}
                        className="text-red-500 hover:bg-red-950/30 cursor-pointer focus:text-red-500 focus:bg-red-950/30"
                    >
                        Log out
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

            <LogoutModal isOpen={showLogoutModal} setIsOpen={setShowLogoutModal} />
        </>
    );
};

export default UserDropdown;