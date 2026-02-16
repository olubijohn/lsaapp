import NovaLogo from "@/components/ui/nova-logo";

const MobileNavbar = () => {
    return (
        <nav className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center">
                <NovaLogo size="sm" className="flex-row items-center gap-3" />
            </div>
        </nav>
    );
};

export default MobileNavbar;