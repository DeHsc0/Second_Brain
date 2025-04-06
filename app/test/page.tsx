"use client"

import { testContext } from "@/providers/dashboardProvider";
import { useContext} from "react"

export default function test(){

    const x = useContext(testContext)

    console.log(x)

    return (
        <div>
            <h1 className="text-2xl text-white">
                {x.test}
            </h1>          
        </div>
    )


}