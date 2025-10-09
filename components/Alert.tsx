"use client"

// takes alerts as an array of strings

import { X } from "lucide-react"
import { motion , AnimatePresence } from "framer-motion"


import { useContext} from "react"
import { DataContext } from "@/providers/dashboardProvider"


export function Alert (){

    const data = useContext(DataContext)

    return(
        <div className={`${data && data.alert.length !== 0 ? "" : "hidden"} fixed pr-2 z-50 top-[77px] right-0`}>
            <AnimatePresence>
                <motion.div 
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300, duration: 4 }}
                    className="flex flex-col gap-4 z-0">
                    {data && data.alert.map((alertContent, index) => {
                        return (
                            <div key={index} className="bg-[#292929] flex items-center gap-4 shadow-lg rounded-lg p-4 max-w-md border-l-4 border-red-500">
                                <X
                                    onClick={() => data?.removeAlert(alertContent)}
                                    className="border p-2 size-8 rounded-lg border-red-400 text-red-400 hover:bg-red-400/20"/>
                                {alertContent}             
                            </div>
                        )
                    })}
                </motion.div>
            </AnimatePresence>
        </div>
    )

}