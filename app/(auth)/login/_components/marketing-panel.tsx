import Logo from "@/components/ui/logo";
import TestimonialSlider from "./testimonial-slider";

const MarketingPanel = () => {
    return (
        <div className="hidden h-full lg:flex bg-[#0047FF] text-white flex-col justify-between p-12 rounded-3xl relative overflow-hidden">
            {/* Background pattern/gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0047FF] via-[#0062FF] to-[#003DCB] opacity-100" />
            <div className="absolute inset-0 bg-[url('/images/authbg.png')] bg-cover bg-center bg-no-repeat mix-blend-overlay opacity-30" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-10">
                    <Logo width={160} height={45} className="drop-shadow-sm" />
                </div>

                <div className="space-y-6 max-w-xl">
                    <h2 className="text-4xl xl:text-5xl font-extrabold leading-[1.15] tracking-tight">
                        Simplifying management for <span className="text-blue-200">schools</span>, educators, and administrators.
                    </h2>

                    <p className="text-lg leading-relaxed text-blue-50/90 font-medium">
                        We are redefining how African educational institutions handle
                        administration and student data. Whether you're a small primary
                        school, a busy high school, or a large university, we provide you
                        with simple, smart tools to help you manage enrollments, track
                        academic progress, and stay organized—all from one platform.
                    </p>
                </div>
            </div>

            <div className="relative z-10">
                <TestimonialSlider />
            </div>
        </div>
    );
};

export default MarketingPanel;
