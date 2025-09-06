import React from 'react'
import { Outlet } from 'react-router-dom'
// import Header from './Header' // Removed Header import
import CartTab from './CartTab'
import { useSelector } from 'react-redux'

const Layout = () => {
  const statusTabCart = useSelector(store => store.cart.statusTab);
  return (
    <div className='min-h-screen'>
      <div>
        {/* <Header /> Removed Header from layout */}
        <main className={`transform transition-transform duration-500
        ${statusTabCart === false ? "" : "-translate-x-56"}`} style={{ backgroundColor: '#ffffff' }}>
          <Outlet />
        </main>
      </div>
      <CartTab />
    </div>
  )
}

export default Layout