import Link from 'next/link';
import Image from 'next/image';
import UserDropdown from './UserDropdown';
import { getCurrentUser } from '@/lib/actions/auth.action';

const Navbar = async () => {
    const user = await getCurrentUser();

    return (
        <nav className="flex justify-between items-center w-full px-6 py-4 border-b border-gray-800 bg-dark-100 z-50 sticky top-0">

            <Link href="/" className="flex items-center gap-2 w-fit">
                <Image src="/logo.svg" width={32} height={32} alt="DevMock Logo" />
                <p className="text-2xl font-bold text-white max-sm:hidden">
                    Dev<span className="text-primary-200">Mock</span>
                </p>
            </Link>

            <div className="flex items-center gap-5">
                {user ? (
                    <UserDropdown user={user} />
                ) : (
                    <Link href="/sign-in" className="text-sm font-semibold text-primary-200 hover:underline">
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;