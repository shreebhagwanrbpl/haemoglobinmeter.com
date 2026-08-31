import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
            <div className="max-w-xl w-full text-center">
                {/* 404 Graphic */}
                <div className="relative mb-8">
                    <h1 className="text-[120px] font-black text-slate-200 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl animate-bounce">🔬</span>
                    </div>
                </div>

                {/* Text Content */}
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">
                    Page Not Found
                </h2>
                <p className="text-slate-600 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                    The laboratory equipment, product page, or location you are looking for does not exist or has been relocated.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-700 px-8 py-4 text-white font-semibold shadow-lg shadow-sky-700/20 transition-all duration-300 hover:-translate-y-1 hover:bg-sky-800 hover:shadow-xl active:scale-95"
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>
                    <Link
                        href="/items"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-8 py-4 text-slate-700 font-semibold shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-slate-50 active:scale-95"
                    >
                        <Search size={18} />
                        Browse Catalog
                    </Link>
                </div>

                {/* Support details */}
                <div className="mt-16 text-sm text-slate-400">
                    Need assistance? Contact Raj Biosis Support at{" "}
                    <a href="mailto:rajbiosis@yahoo.in" className="text-sky-600 hover:underline">
                        rajbiosis@yahoo.in
                    </a>
                </div>
            </div>
        </div>
    );
}
