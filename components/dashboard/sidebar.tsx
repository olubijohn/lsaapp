"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import {
  Settings,
  CreditCard,
  Key,
  ChevronDown,
  ChevronUp,
  User,
  ArrowRight,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { useLogoutMutation } from "@/lib/auth/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ComponentType } from "react";
import {
  DashboardIcon,
  UserManagementIcon,
  SalesIcon,
  PurchasesIcon,
  InventoryIcon,
  ReportsIcon,
  AdministrationIcon,
} from "@/components/ui/sidebar-icons";
import { useMobileSidebar } from "@/lib/context/mobile-sidebar-context";

interface NavItem {
  name: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
}

interface NavGroup {
  name: string;
  icon?: ComponentType<{ className?: string }>;
  children: NavItem[];
}

type NavigationItem = NavItem | NavGroup;

const navigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard/home", icon: DashboardIcon },
  {
    name: "User Management",
    href: "/dashboard/users",
    icon: UserManagementIcon,
  },
  {
    name: "Sales",
    icon: SalesIcon,
    children: [
      { name: "Invoices", href: "/dashboard/invoices" },
      { name: "Invalid Invoices", href: "/dashboard/invalid-invoices" },
    ],
  },
  {
    name: "Purchases",
    icon: PurchasesIcon,
    children: [
      { name: "Purchase Order", href: "/dashboard/purchases" },
      {
        name: "Invalid Purchase Order",
        href: "/dashboard/failed-purchase-orders",
      },
    ],
  },
  { name: "Inventory", href: "/dashboard/inventory", icon: InventoryIcon },
  { name: "Branches", href: "/dashboard/branches", icon: InventoryIcon },
  { name: "Reports", href: "/dashboard/reports", icon: ReportsIcon },
  {
    name: "Administration",
    icon: AdministrationIcon,
    children: [
      {
        name: "Subscription",
        href: "/dashboard/subscriptions",
        icon: CreditCard,
      },
      { name: "API Keys", href: "/dashboard/api-keys", icon: Key },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

function isNavItem(item: NavigationItem): item is NavItem {
  return "href" in item;
}

function isNavGroup(item: NavigationItem): item is NavGroup {
  return "children" in item;
}

interface NavItemComponentProps {
  item: NavItem;
  pathname: string;
  onClick?: () => void;
}

function NavItemComponent({ item, pathname, onClick }: NavItemComponentProps) {
  const isActive = pathname === item.href;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group flex items-center px-4 py-2.5 text-sm font-medium rounded-r-full transition-colors cursor-pointer",
        isActive
          ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent",
      )}
    >
      {item.icon && (
        <item.icon
          className={cn(
            "mr-3 shrink-0 h-5 w-5",
            isActive
              ? "text-blue-600"
              : "text-gray-400 group-hover:text-gray-500",
          )}
        />
      )}
      {item.name}
    </Link>
  );
}

interface NavGroupComponentProps {
  group: NavGroup;
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
  onClick?: () => void;
}

function NavGroupComponent({
  group,
  pathname,
  isOpen,
  onToggle,
  onClick,
}: NavGroupComponentProps) {
  const isActive = group.children.some((child) => pathname === child.href);
  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          "group flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium rounded-r-full transition-colors cursor-pointer",
          isActive
            ? "text-blue-600 bg-blue-50/50"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        )}
      >
        <div className="flex items-center">
          {group.icon && (
            <group.icon
              className={cn(
                "mr-3 shrink-0 h-5 w-5",
                isActive
                  ? "text-blue-600"
                  : "text-gray-400 group-hover:text-gray-500",
              )}
            />
          )}
          {group.name}
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="ml-4 mt-1 space-y-1">
          {group.children.map((child) => (
            <NavItemComponent
              key={child.name}
              item={child}
              pathname={pathname}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, isLoading, logout: contextLogout } = useAuth();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();
  const { isSidebarOpen, closeSidebar } = useMobileSidebar();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Sales: false,
    Purchases: false,
    Administration: false,
  });

  if (isLoading) {
    return null; // Or a skeleton
  }

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
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

  const handleNavigation = () => {
    closeSidebar();
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar Panel */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-[280px] bg-white transition-transform duration-300 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <Image
              src="/images/logowhite.svg"
              alt="FiscalEdge Logo"
              width={140}
              height={32}
              className="h-8 w-auto"
            />
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto w-auto hover:bg-transparent"
              onClick={closeSidebar}
            >
              <X className="h-6 w-6 text-gray-500" />
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-3">
              {navigation.map((item) => {
                if (isNavItem(item)) {
                  return (
                    <NavItemComponent
                      key={item.name}
                      item={item}
                      pathname={pathname}
                      onClick={handleNavigation}
                    />
                  );
                } else if (isNavGroup(item)) {
                  return (
                    <NavGroupComponent
                      key={item.name}
                      group={item}
                      pathname={pathname}
                      isOpen={openGroups[item.name] || false}
                      onToggle={() => toggleGroup(item.name)}
                      onClick={handleNavigation}
                    />
                  );
                }
                return null;
              })}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t border-gray-100">
            <div 
              onClick={handleLogout}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-gray-100">
                  <AvatarFallback className="bg-orange-100 text-orange-600">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user
                      ? `${user.firstName} ${user.lastName}`
                      : "Chipo Tembo"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.roles?.[0] || "Super Admin"}
                  </p>
                </div>
              </div>
              <LogOut className="h-4 w-4 text-gray-400 group-hover:text-red-600 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-[280px] lg:flex-col lg:bg-white lg:fixed lg:inset-y-0 lg:left-0 z-20">
        {/* Header */}
        <div className="flex items-center px-6 py-5 border-b border-gray-100">
          <Image
            src="/images/logowhite.svg"
            alt="FiscalEdge Logo"
            width={140}
            height={32}
            className="h-8 w-auto"
          />
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-3">
            {navigation.map((item) => {
              if (isNavItem(item)) {
                return (
                  <NavItemComponent
                    key={item.name}
                    item={item}
                    pathname={pathname}
                  />
                );
              } else if (isNavGroup(item)) {
                return (
                  <NavGroupComponent
                    key={item.name}
                    group={item}
                    pathname={pathname}
                    isOpen={openGroups[item.name] || false}
                    onToggle={() => toggleGroup(item.name)}
                  />
                );
              }
              return null;
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div 
            onClick={handleLogout}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-gray-100">
                <AvatarFallback className="bg-orange-100 text-orange-600">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user ? `${user.firstName} ${user.lastName}` : "Chipo Tembo"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.roles?.[0] || "Super Admin"}
                </p>
              </div>
            </div>
            <LogOut className="h-4 w-4 text-gray-400 group-hover:text-red-600 flex-shrink-0" />
          </div>
        </div>
      </div>
    </>
  );
}
