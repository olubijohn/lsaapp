import Container from "@/components/ui/container";

interface LoginLayoutProps {
    children: React.ReactNode;
}

const LoginLayout = ({ children }: LoginLayoutProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Container size="xl">
                {children}
            </Container>
        </div>
    );
};

export default LoginLayout;