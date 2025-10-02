"use client"

import { Manrope } from 'next/font/google'
import {Check} from "lucide-react"

const manrope = Manrope({
    subsets : ["latin"]
})

export default function HeroSection (){

    return (
        <section className={`${manrope.className}`}>
            <div className="flex justify-center px-4 md:px-24 lg:px-48 py-16 flex-col gap-8">
                <div className="flex-col gap-[18px]">
                    <h1 className="text-3xl md:text-5xl lg:text-[56px] text-center leading-tight">
                    Access your{" "}
                    <span className="underline text-emerald-400 inline underline-offset-8">
                        contents at anytime
                    </span>{" "}
                    with minimal hassle.
                    </h1>
                    <p className="text-center text-zinc-500 max-w-3xl mx-auto mt-6">
                    Providing instant access to your Contents anytime, anywhere. With a
                    user-friendly interface and features like semantic search, managing your
                    contents has never been easier.
                    </p>
                </div>
                <div className="flex flex-col justify-center gap-5 mt-4">
                    <button
                    className="text-xl font-mono w-fit self-center rounded-full px-5 py-3 bg-emerald-400 text-black hover:text-white hover:bg-[#292929] duration-300"
                    tabIndex={0}
                    >
                    Create collections now
                    </button>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-6">
                        <div className="flex gap-2 items-center">
                            <Check className="lucide lucide-check text-emerald-400 text-[16px]" />
                            <h1>Unlimited Collections</h1>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Check className="lucide lucide-check text-emerald-400 text-[16px]" />
                            <h1>Unlimited Contents</h1>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Check className="lucide lucide-check text-emerald-400 text-[16px]" />
                            <h1>User friendly setup</h1>
                        </div>
                    </div>
                </div>
            </div>;

        </section>
    )
}