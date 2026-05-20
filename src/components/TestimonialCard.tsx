import type { Testimonial } from "@/src/types";
import { BadgeCheckIcon } from "lucide-react";
import Image from "next/image";

type TestimonialCardProps = {
    testimonial: Testimonial;
};

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0">
            <div className="flex gap-2">
                <Image
                    className="size-11 rounded-full"
                    src={testimonial.image}
                    alt={testimonial.name}
                    height={50}
                    width={50}
                />
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <p>{testimonial.name}</p>
                        <BadgeCheckIcon size={14} className="text-sky-500 fill-sky-100" />
                    </div>
                    <span className="text-xs text-slate-500">{testimonial.handle}</span>
                </div>
            </div>
            <p className="text-sm pt-4 text-gray-800">{testimonial.quote}</p>
        </div>
    );
}
