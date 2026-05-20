import { MessageCircle } from "lucide-react";

export default function BottomBanner() {
    return (
        <div
            id="contact"
            className="border-y border-dashed border-slate-200 w-full max-w-5xl mx-auto mt-28 px-16"
        >
            <div className="flex flex-col md:flex-row text-center md:text-left items-center justify-between gap-8 px-3 md:px-10 border-x border-dashed border-slate-200 py-20 -mt-10 -mb-10 w-full">
                <p className="text-xl font-medium max-w-sm">
                    Join 1,200+ landlords in Bangladesh already managing their properties
                    with BariBari.
                </p>
                <button className="flex items-center gap-2 rounded-md py-3 px-5 bg-indigo-600 hover:bg-indigo-700 transition text-white">
                    <MessageCircle size={20} />
                    <span>Talk to Sales on WhatsApp</span>
                </button>
            </div>
        </div>
    );
}
