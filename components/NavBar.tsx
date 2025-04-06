"use client"

import { Brain } from "lucide-react"
import { motion} from "framer-motion"
import { SignUpButton } from '@clerk/nextjs'

export default function NavBar () {

    return (
        <div className="px-[102px] py-4 flex justify-between items-center border-b-1 bg-[#141414] border-[#282828]">
            <div className="flex gap-2 text-[16px]">
                <Brain className="text-emerald-400"/>
                <h1 className="font-mono">
                    SECOND BRAIN
                </h1>
            </div>
            <div className="flex gap-10 items-center">
                <a href="/pricing" className="font-mono">
                    PRICING
                </a>
                <a href="/features" className="font-mono">
                    FEATURES
                </a>
                <SignUpButton mode="redirect">
                    <motion.button

                    transition={{
                        type : "spring",
                        duration : 0
                    }}

                    whileTap={{
                        scale : 0.9
                    }}
                    className="font-mono rounded-full px-7 py-2 bg-[#292929] duration-300 hover:text-black  hover:bg-emerald-400/100 ">
                        START FOR FREE
                    </motion.button>
                </SignUpButton>
            </div>
        </div>
    )
}