import Logo from "@/components/ui/logo";

const MobileNavbar = () => {
    return (
        <nav className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center">
                <Logo variant="black" width={120} height={24} />
            </div>
        </nav>
    );
};

export default MobileNavbar;