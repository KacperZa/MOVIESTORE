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
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{user, setUser}}> 
            { children }
        </UserContext.Provider>
    )
  }

export default UserContext;
