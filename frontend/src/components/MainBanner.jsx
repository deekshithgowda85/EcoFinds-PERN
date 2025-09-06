import React from 'react'
import { Link } from 'react-router-dom'
import whiteArrowIcon from '../assets/white_arrow_icon.svg'
import blackArrowIcon from '../assets/black_arrow_icon.svg'
import electronicsbg from '../assets/electronicsbg.png';

const MainBanner = () => {
  return (
    <div className='relative h-[80vh] overflow-hidden flex items-center justify-center bg-gradient-to-r from-green-100 via-blue-50 to-green-100 mt-0 z-10 border-b border-gray-200'>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2348bb78' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <img
        src={electronicsbg}
        alt="Main Banner"
        className='w-auto h-[70vh] object-contain z-20 opacity-90'
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />

      <div className='absolute inset-0 flex items-center p-6 md:px-12 lg:px-24 z-30'>
        <div className='flex flex-col items-start max-w-2xl'>
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-full">
              🌱 Eco-Friendly Shopping
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-left leading-tight text-gray-800 mb-6 drop-shadow-sm">
            Find Eco-Friendly Products You Can Trust!
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
            Discover sustainable products that make a difference. From organic products to eco-friendly electronics.
          </p>

          <div className='flex items-center font-medium gap-4 mt-4'>
            <div className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-green-500 hover:bg-green-600 transition-all duration-300 rounded-lg text-white cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' onClick={() => document.getElementById('featured-products').scrollIntoView({ behavior: 'smooth' })}>
              Shop Now
              <img className='md:hidden transition group-hover:translate-x-1' src={whiteArrowIcon} alt="arrow" />
            </div>

            <Link to={"/electronics"} className='group hidden md:flex items-center gap-2 px-9 py-3 bg-white hover:bg-gray-50 transition-all duration-300 rounded-lg text-gray-800 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-gray-200'>
              Explore Electronics
              <img className='transition group-hover:translate-x-1' src={blackArrowIcon} alt="arrow" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default MainBanner