import { createContext, useState, type ReactNode } from "react";

type User = {
    creationDate: string
    dateOfBirth: string
    email: string
    password: string
    username: string
    __v: number
    _id: string
};

type UserContextType = {
    user: User | null
    setUser: (user: User | null) => void;
};

  const UserContext = createContext<UserContextType | null >(null)

  export const UserProvider = ({ children }: {children : ReactNode}) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('user')
        return saved ? JSON.parse(saved) : null
    });

    const handleSetUser = (user: User | null) => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
        } else {
            localStorage.removeItem('user')
        }
        setUser(user)
    }

    return (
        <UserContext.Provider value={{user, setUser: handleSetUser}}> 
            { children }
        </UserContext.Provider>
    )
  }

export default UserContext;
