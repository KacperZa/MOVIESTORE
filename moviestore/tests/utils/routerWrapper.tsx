import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { createWrapper } from './createWrapper'

function routerWrapper({ children } : {children: React.ReactNode }) {
  return (
    <MemoryRouter>
        {createWrapper()({children })}
    </MemoryRouter>
  )
}

export default routerWrapper