import { it, expect, describe, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import MenuOptionBrowse from '../../src/MenuComponents/MenuOptionLogout'
import { type User } from '../../src/context/UserContext'
import { MemoryRouter } from 'react-router-dom'
import { useUser } from '@/context/useUser'

const userData : User = {
    creationDate: "01-02-2003:16:56:76",
    age: 21,
    email: "lacper.zajac765@gmail.ccc",
    password: "kacper121!",
    username: "Kacper",
    __v: 1212,
    _id: "12121" 
}

vi.mock('@/context/useUser', () => ({
    useUser: vi.fn()
}))

describe('MenuOptionLogout', () => {

    const renderComponentWithContext = () => {
        render(
            <MemoryRouter>
                <MenuOptionBrowse />
            </MemoryRouter>
        ) 
    }
    
    it('should render Logout icon and Logout text when user logged in', () => {
        
        vi.mocked(useUser).mockReturnValue({
            user: userData,
            setUser: vi.fn()
        })

       renderComponentWithContext()
       
        expect(screen.getByText(/logout/i)).toBeInTheDocument()
        expect(screen.getByTestId('logout-icon')).toBeInTheDocument()
    })

    it('should render Login icon and text when user logged out', () => {

        vi.mocked(useUser).mockReturnValue({
            user: null,
            setUser: vi.fn()
        })
        
        renderComponentWithContext()
        expect(screen.getByText(/login/i)).toBeInTheDocument()
        expect(screen.getByTestId('login-icon')).toBeInTheDocument()

    })

})