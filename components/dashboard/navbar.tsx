"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Bell,
    Menu,
    Search,
    User,
    Briefcase,
    ArrowLeftRight,
    Activity,
    LogOut,
    HelpCircle,
    ChevronDown,
} from "lucide-react";
import InvoiceSearch from "@/components/dashboard/invoice-search";
import { useAuth } from "@/lib/auth/context";
import { useLogoutMutation } from "@/lib/auth/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMobileSidebar } from "@/lib/context/mobile-sidebar-context";
import { cn } from "@/lib/utils";

export function Navbar() {
    const { user, logout: contextLogout } = useAuth();
    const logoutMutation = useLogoutMutation();
    const router = useRouter();
    const { toggleSidebar } = useMobileSidebar();

    const getInitials = (firstName?: string, lastName?: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
    };

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
            contextLogout();
            toast.success("Logged out successfully");
            router.push("/login");
        } catch (error) {
            contextLogout();
            router.push("/login");
        }
    };

    return (
        <header className="fixed top-0 right-0 left-0 lg:left-[280px] z-30 bg-white h-[72px] border-b border-gray-100 transition-all duration-200">
            <div className="flex items-center justify-between h-full px-4 lg:px-6 gap-4">
                <div className="flex items-center flex-1 min-w-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="lg:hidden mr-2 flex-shrink-0 p-0 h-9 w-9"
                        onClick={toggleSidebar}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <InvoiceSearch />
                </div>

                <div className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="hidden sm:flex bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium h-9 px-4 rounded-full gap-2 border border-gray-200"
                    >
                        <HelpCircle className="h-4 w-4" />
                        Help
                    </Button>

                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative text-gray-500 hover:text-gray-700 cursor-pointer h-10 w-10 bg-white rounded-full border border-gray-200 shadow-sm"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full border-[1.5px] border-white"></span>
                    </Button>

                    {/* User menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer p-0 ml-1">
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                    <AvatarFallback className="bg-gray-800 text-white text-xs font-medium">
                                        {getInitials(user?.firstName, user?.lastName)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal p-2">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border border-gray-200">
                                        <AvatarFallback className="bg-gray-800 text-white text-sm font-medium">
                                            {getInitials(user?.firstName, user?.lastName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col space-y-0.5">
                                        <p className="text-sm font-semibold leading-none text-gray-900">
                                            {user?.firstName} {user?.lastName}
                                        </p>
                                        <p className="text-xs leading-none text-gray-500 truncate max-w-[150px]">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="my-2" />
                            <div className="space-y-1">
                                <DropdownMenuItem className="cursor-pointer text-gray-700 focus:text-blue-600 focus:bg-blue-50 py-2.5">
                                    <User className="mr-3 h-4 w-4" />
                                    <span>My Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-gray-700 focus:text-blue-600 focus:bg-blue-50 py-2.5">
                                    <Briefcase className="mr-3 h-4 w-4" />
                                    <span>Company Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-gray-700 focus:text-blue-600 focus:bg-blue-50 py-2.5">
                                    <ArrowLeftRight className="mr-3 h-4 w-4" />
                                    <span>Switch Company</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-2" />
                                <DropdownMenuItem className="cursor-pointer text-gray-700 focus:text-blue-600 focus:bg-blue-50 py-2.5">
                                    <Activity className="mr-3 h-4 w-4" />
                                    <span>My Activity</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer text-gray-700 focus:text-red-600 focus:bg-red-50 py-2.5"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-3 h-4 w-4" />
                                    <span>Log Out</span>
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
