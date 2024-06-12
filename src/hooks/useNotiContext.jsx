import { NotiContext } from "@/context/notiContext"
import { useContext } from "react"

export const useNotiContext = ()=>{
const context = useContext(NotiContext)

if(!context){
    throw Error('useNotiContext must be used inside an AuthContextProvider')
}
return context
}