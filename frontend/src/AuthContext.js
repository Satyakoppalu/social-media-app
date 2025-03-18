import {createContext, useState, useEffect} from "react";

export const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [user, setUser]=useState(null);

    useEffect(()=>{
        const token=localStorage.getItem("token");
        const userId=localStorage.getItem("userId");
        if (token && userId){
            setUser({token, userId});
        }
    }, []);

    const login=(token, userId)=>{
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        setUser({token})
    }

    const logout =()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, setUser, logout, login}}>
            {children}
        </AuthContext.Provider>
    );
};