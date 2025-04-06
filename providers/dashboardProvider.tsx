

import { DashbordProvider, Sort} from "@/lib/types/types"
import { createContext, useState } from "react"

export const DataContext = createContext<DashbordProvider | null>(null) 

export default function DashboardProvider({children} : {children : React.ReactNode}){    

    const [sort , setSort] = useState<Sort>("Default")    
    const [ alert , setAlert ] = useState<string[]>([])
    const data : DashbordProvider = { 
        alert, 
        addAlert : (newAlert : string) => setAlert(prevAlerts => [...prevAlerts , newAlert]), 
        removeAlert : (alertContent : string) =>  {
            setAlert(() => {
                return alert.filter(item => item !== alertContent)
            })
        }, 
        sortType : sort, 
        changeSort : (newSort : Sort) => setSort(newSort)
    }
    
    return <DataContext.Provider value={data}>
        {children}
    </DataContext.Provider>
}