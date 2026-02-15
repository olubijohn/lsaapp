import MobileNavbar from "./mobile-navbar";

const LoginSkeleton = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <MobileNavbar />
            <div className="flex-1 p-4 grid lg:grid-cols-2">
                {/* Left Panel Skeleton */}
                <div className="hidden lg:flex bg-[#0062FF] flex-col justify-center p-12 min-h-screen">
                    <div>
                        {/* Logo Skeleton */}
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-36 h-10 bg-white/20 rounded animate-pulse" />
                        </div>

                        {/* Heading Skeleton */}
                        <div className="mt-16 space-y-3">
                            <div className="h-10 bg-white/20 rounded animate-pulse w-3/4" />
                            <div className="h-10 bg-white/20 rounded animate-pulse w-full" />
                            <div className="h-10 bg-white/20 rounded animate-pulse w-2/3" />
                        </div>

                        {/* Description Skeleton */}
                        <div className="mt-6 space-y-2">
                            <div className="h-4 bg-white/20 rounded animate-pulse w-full" />
                            <div className="h-4 bg-white/20 rounded animate-pulse w-full" />
                            <div className="h-4 bg-white/20 rounded animate-pulse w-4/5" />
                        </div>
                    </div>

                    {/* Testimonial Skeleton */}
                    <div className="bg-black/50 rounded-2xl p-6 mt-12">
                        <div className="space-y-3">
                            <div className="h-4 bg-white/20 rounded animate-pulse w-full" />
                            <div className="h-4 bg-white/20 rounded animate-pulse w-full" />
                            <div className="h-4 bg-white/20 rounded animate-pulse w-3/4" />
                        </div>
                        <div className="flex items-center gap-3 mt-6">
                            <div className="w-12 h-12 bg-white/20 rounded-full animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-4 bg-white/20 rounded animate-pulse w-32" />
                                <div className="h-3 bg-white/20 rounded animate-pulse w-24" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel Skeleton */}
                <div className="flex flex-col items-center justify-center bg-white px-8 py-12">
                    <div className="w-full max-w-md space-y-8">
                        {/* Title Skeleton */}
                        <div className="text-center space-y-2">
                            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto" />
                        </div>

                        {/* Form Skeleton */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                                <div className="h-11 bg-gray-200 rounded animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                                <div className="h-11 bg-gray-200 rounded animate-pulse" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                                </div>
                                <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                            </div>
                            <div className="h-12 bg-gray-200 rounded animate-pulse" />
                        </div>

                        {/* Help Section Skeleton */}
                        <div className="bg-[#EDF4FF] rounded-lg py-6 space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-40 mx-auto" />
                            <div className="h-4 bg-blue-200 rounded animate-pulse w-20 mx-auto" />
                        </div>

                        {/* Register Link Skeleton */}
                        <div className="text-center">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mx-auto" />
                        </div>
                    </div>

                    {/* Footer Skeleton */}
                    <div className="mt-8">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-64" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginSkeleton;