import { StaffAuthContext } from "@/context/staffAuthContext";

import { useContext } from "react";

export const useStaffAuthContext = ()=>{

    const context = useContext(StaffAuthContext)

    
if(!context){
    throw Error('useStaffAuthContext must be used inside an StaffAuthContextProvider')
}

    return context
}