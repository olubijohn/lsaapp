"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const testimonials = [
    {
        name: "Little Learners School",
        role: "School Administrator",
        initials: "LL",
        content: "Nova LSA has completely transformed our administrative processes. The ease of managing student records and tracking academic progress is unparalleled. It's truly a game-changer for our school."
    },
    {
        name: "Betty Queen School",
        role: "Head of Operations",
        initials: "BQ",
        content: "The reporting features in Nova LSA are incredibly powerful. We can now generate detailed reports in seconds, which used to take hours. The support team is also very responsive and helpful."
    },
    {
        name: "Demonstration Secondary School",
        role: "Principal",
        initials: "DS",
        content: "We've been using Nova LSA for a year now, and the results are amazing. The platform is intuitive and easy to use for both teachers and administrators. It has significantly improved our efficiency."
    },
    {
        name: "Noble Choice Schools",
        role: "Director of Studies",
        initials: "NC",
        content: "Nova LSA is a reliable and secure platform that has helped us streamline our enrollments and fee management. It's a must-have tool for any modern educational institution."
    }
];

const TestimonialSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-black/80 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden transition-all duration-500 hover:bg-black/90 group border border-white/10 shadow-2xl">
            <div className="relative h-48 sm:h-40 overflow-hidden">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className={cn(
                            "absolute inset-0 transition-all duration-700 ease-in-out transform flex flex-col justify-center",
                            index === currentIndex 
                                ? "opacity-100 translate-x-0" 
                                : index < currentIndex 
                                    ? "opacity-0 -translate-x-full" 
                                    : "opacity-0 translate-x-full"
                        )}
                    >
                        <p className="text-sm leading-relaxed text-gray-200">
                            "{testimonial.content}"
                        </p>
                        <div className="flex items-center gap-3 mt-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg ring-2 ring-white/10 text-xs">
                                {testimonial.initials}
                            </div>
                            <div>
                                <p className="font-semibold text-white text-sm">{testimonial.name}</p>
                                <p className="text-xs text-gray-400 group-hover:text-blue-400 transition-colors">{testimonial.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="flex gap-1.5 mt-4 justify-center">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            index === currentIndex ? "w-6 bg-blue-500" : "w-1.5 bg-gray-600 hover:bg-gray-500"
                        )}
                        aria-label={`Go to testimonial ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default TestimonialSlider;
