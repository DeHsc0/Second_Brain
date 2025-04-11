"use client"

import { Manrope } from "next/font/google"
import { SignUpButton } from '@clerk/nextjs'
import { Brain } from "lucide-react"
import { useRouter } from "next/navigation"

const manrope = Manrope({
    subsets : ["latin"]
})

export default function NavBar ({ signedIn } : {signedIn : boolean}) {

    const router = useRouter()

    return (
        <div className={`${manrope.className} px-4 md:px-[102px] py-4 flex justify-between items-center border-b border-[#282828] bg-[#141414] sticky top-0 z-50`}>
            <a className="flex gap-2 text-[16px]" href="/">
                <Brain className="lucide lucide-brain text-emerald-400"/>
                <h1 className="font-mono">SECOND BRAIN</h1>
            </a>
            <div className="flex gap-4 md:gap-10 items-center">
                <a className="font-mono hidden md:block" href="/pricing">
                PRICING
                </a>
                <a className="font-mono hidden md:block" href="/features">
                FEATURES
                </a>
                {signedIn ? <button 
                onClick={() => router.push("/dashboard")}
                className="font-mono rounded-full px-4 md:px-7 py-2 bg-[#292929] duration-300 hover:text-black hover:bg-emerald-400/100" tabIndex={0}>
                    Go to Dashboard
                </button> : <SignUpButton forceRedirectUrl={"/dashboard"}>
                    <button
                    className="font-mono rounded-full px-4 md:px-7 py-2 bg-[#292929] duration-300 hover:text-black hover:bg-emerald-400/100" tabIndex={0}>
                        START FOR FREE
                    </button>
                </SignUpButton> }
            </div>
        </div>
    )
}