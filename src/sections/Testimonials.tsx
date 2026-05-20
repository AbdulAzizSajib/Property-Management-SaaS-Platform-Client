import SectionTitle from "@/src/components/SectionTitle";
import TestimonialCard from "@/src/components/TestimonialCard";
import { testimonialsData } from "@/src/data/testimonialsData";
import Marquee from "react-fast-marquee";

export default function Testimonials() {
    return (
        <>
            <SectionTitle
                text1="Testimonials"
                text2="Loved by landlords across Bangladesh"
                text3="From Dhaka and Chattogram to Sylhet and Khulna — thousands of property owners trust BariBari every month."
            />

            <Marquee className="max-w-5xl mx-auto mt-11" gradient={true} speed={25}>
                <div className="flex items-center justify-center py-5">
                    {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} />
                    ))}
                </div>
            </Marquee>
            <Marquee
                className="max-w-5xl mx-auto"
                gradient={true}
                speed={25}
                direction="right"
            >
                <div className="flex items-center justify-center py-5">
                    {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} />
                    ))}
                </div>
            </Marquee>
        </>
    );
}
