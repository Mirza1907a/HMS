const { useAuthContextProvider } = require("./useAuthContext")

const useLogout = ()=>{

    const {user,dispatch} = useAuthContextProvider();
    const Logout = async()=>{
dispatch({type: "LOGOUT",payload})
    }
}