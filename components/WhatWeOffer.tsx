import { Code, FileText, Globe, Youtube } from "lucide-react";

export default function WhatWeOffer () {
    return (
        <section className="py-5 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 opacity-[1]" >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Store <span className="text-emerald-400">Any Content Type</span> In One
                        Place
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Create collections for different content types and access them with
                        powerful semantic search.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div
                        className="bg-[#1A1A1A] border border-[#282828] rounded-xl p-6 flex flex-col items-center text-center gap-4 hover:border-emerald-400/30 transition-colors duration-300 transform-none opacity-[1]">
                        <div className="w-16 h-16 bg-[#202020] rounded-full flex items-center justify-center mb-2">
                            <Globe className="lucide lucide-globe text-emerald-400 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold">WEBPAGE</h3>
                        <p className="text-zinc-400">
                        Save articles, blog posts, and other web content for easy access.
                        </p>
                    </div>
                    <div
                        className="bg-[#1A1A1A] border border-[#282828] rounded-xl p-6 flex flex-col items-center text-center gap-4 hover:border-emerald-400/30 transition-colors duration-300 opacity-[1] transform-none">
                        <div className="w-16 h-16 bg-[#202020] rounded-full flex items-center justify-center mb-2">
                            <Youtube className="lucide lucide-youtube text-emerald-400 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold">YOUTUBE</h3>
                        <p className="text-zinc-400">
                        Collect and organize your favorite videos and tutorials.
                        </p>
                    </div>
                    <div
                        className="bg-[#1A1A1A] border border-[#282828] rounded-xl p-6 flex flex-col items-center text-center gap-4 hover:border-emerald-400/30 transition-colors duration-300 opacity-[1] transform-none">
                        <div className="w-16 h-16 bg-[#202020] rounded-full flex items-center justify-center mb-2">
                            <FileText className="lucide lucide-file-text text-emerald-400 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold">NOTE</h3>
                        <p className="text-zinc-400">
                            Create and store your personal notes and ideas.
                        </p>
                    </div>
                    <div
                        className="bg-[#1A1A1A] border border-[#282828] rounded-xl p-6 flex flex-col items-center text-center gap-4 hover:border-emerald-400/30 transition-colors duration-300 opacity-[1] transform-none">
                        <div className="w-16 h-16 bg-[#202020] rounded-full flex items-center justify-center mb-2">
                            <Code className="lucide lucide-code text-emerald-400 w-8 h-8"/>
                        </div>
                        <h3 className="text-xl font-bold">CODE</h3>
                        <p className="text-zinc-400">
                        Save code snippets and programming references.
                        </p>
                    </div>
                </div>
            </div>
    </section>

    )
}