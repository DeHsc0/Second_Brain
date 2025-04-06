"use client"

import DashboardProvider from "@/providers/dashboardProvider";

export default function RootLayout({
    children
} : {children : React.ReactNode}){

    return <DashboardProvider>
        {children}
    </DashboardProvider>
}