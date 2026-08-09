import { it, expect, describe, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MenuOptionBrowse from '../../src/MenuComponents/MenuOptionLogout'
import UserContext, { User } from '../../src/context/UserContext'
import { MemoryRouter } from 'react-router-dom'

describe('MenuOptionLogout', () => {

    const renderComponentWithContext = (user : User | null) => {
        render(
        <UserContext.Provider value={{user, setUser: vi.fn()}}> 
            <MemoryRouter>
                <MenuOptionBrowse />
            </MemoryRouter>
        </UserContext.Provider>
        ) 
    }
    it('should render Logout icon and Logout text when user logged in', () => {
        const user : User = {
            creationDate: "01-02-2003:16:56:76",
            age: 21,
            email: "lacper.zajac765@gmail.ccc",
            password: "kacper121!",
            username: "Kacper",
            __v: 1212,
            _id: "12121"
        }

       renderComponentWithContext(user)
       
        expect(screen.getByText(/logout/i)).toBeInTheDocument()
        expect(screen.getByTestId('logout-icon')).toBeInTheDocument()
    })

    it('should render Login icon and text when user logged out', () => {
        
        renderComponentWithContext(null)
        expect(screen.getByText(/login/i)).toBeInTheDocument()
        expect(screen.getByTestId('login-icon')).toBeInTheDocument()

    })

})