import BottomBanner from "@/src/sections/BottomBanner";
import { FaqSection } from "@/src/sections/FaqSection";
import FeaturesSection from "@/src/sections/FeaturesSection";
import HeroSection from "@/src/sections/HeroSection";
import HowItWorks from "@/src/sections/HowItWorks";
import IntegrationsSection from "@/src/sections/IntegrationsSection";
import Pricing from "@/src/sections/Pricing";
import ProductDeepDive from "@/src/sections/ProductDeepDive";
import Testimonials from "@/src/sections/Testimonials";
import TrustedCompanies from "@/src/sections/TrustedCompanies";

export default function Page() {
    return (
        <>
            <HeroSection />
            {/* <TrustedCompanies /> */}
            <FeaturesSection />
            <ProductDeepDive />
            {/* <IntegrationsSection /> */}
            <HowItWorks />
            <Testimonials />
            <Pricing />
            <FaqSection />
            <BottomBanner />
        </>
    );
}
