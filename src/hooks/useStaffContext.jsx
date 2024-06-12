import { StaffContext } from "@/context/staffContext";

import { useContext } from "react";

export const useStaffContext = ()=>{

    const context = useContext(StaffContext)

    
if(!context){
    throw Error('useStaffContext must be used inside an StaffContextProvider')
}

    return context
}