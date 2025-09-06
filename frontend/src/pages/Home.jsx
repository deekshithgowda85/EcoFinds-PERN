import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { apiService } from '../services/api';
import { toggleStatusTab } from '../stores/Cart';
import { setSearchQuery } from '../stores/Search';
import Navbar from '../components/Navbar';
import ProductCart from '../components/ProductCart';
import CartTab from '../components/CartTab';
import MainBanner from '../components/MainBanner';
import iconCart from '../assets/images/iconCart.png';

function Homescene() {
  const [products, setProducts] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('products');
  const [totalQuantity, setTotalQuantity] = useState(0);
  
  const carts = useSelector(store => store.cart.items);
  const dispatch = useDispatch();
  const searchQuery = useSelector(store => store.search.searchQuery);

  useEffect(() => {
    let total = 0;
    carts.forEach(item => total += item.quantity);
    setTotalQuantity(total);
  }, [carts]);

  const handleOpenTabCart = () => {
    dispatch(toggleStatusTab());
  };

  const handleSearchInputChange = (event) => {
    dispatch(setSearchQuery(event.target.value));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [productsResponse, groceriesResponse] = await Promise.all([
          apiService.getProducts(),
          apiService.getGroceries()
        ]);
        
        setProducts(productsResponse.data);
        setGroceries(groceriesResponse.data);
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const getCurrentProducts = () => {
    const currentData = activeCategory === 'products' ? products : groceries;
    return currentData.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-black text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <MainBanner />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Selection */}
        <div className="py-8" id="categories">
          <h2 className="text-black text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => handleCategoryClick('products')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeCategory === 'products'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Electronics & Products
            </button>
            <button
              onClick={() => handleCategoryClick('groceries')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeCategory === 'groceries'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Groceries & Food
            </button>
          </div>
        </div>

        {/* Products Section */}
        <div className="pb-8" id="featured-products">
          {/* Container for heading, search, and cart button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-black text-2xl font-bold">
              {activeCategory === 'products' ? 'Featured Products' : 'Fresh Groceries'}
            </h2>

            {/* Search Input */}
            <div className="ml-8 p-5 overflow-hidden w-[60px] h-[60px] hover:w-[270px] bg-gray-100 shadow-[2px_2px_20px_rgba(0,0,0,0.08)] rounded-full flex group items-center hover:duration-300 duration-300">
              <div className="flex items-center justify-center fill-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Isolation_Mode"
                  data-name="Isolation Mode"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22">
                  <path d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z"></path>
                </svg>
              </div>
              <input
                type="text"
                className="outline-none text-[20px] bg-transparent w-full text-gray-800 font-normal px-4"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Search..."
              />
            </div>

            {/* Cart Button */}
            <div 
              className='w-12 h-12 bg-white rounded-full flex justify-center items-center relative cursor-pointer shadow-lg hover:bg-gray-100 transition-colors z-50' 
              onClick={handleOpenTabCart}
            >
              <img src={iconCart} alt="Cart" className='w-7' />
              {totalQuantity > 0 && (
                <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex justify-center items-center font-bold'>
                  {totalQuantity}
                </span>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 p-8">
            {getCurrentProducts().map((product) => (
              <ProductCart
                key={product.id}
                data={product}
                basePath={activeCategory === 'products' ? '/product' : '/groceries'}
                source={activeCategory}
              />
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-8">
            <Link
              to={activeCategory === 'products' ? '/products' : '/groceries'}
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              View All {activeCategory === 'products' ? 'Products' : 'Groceries'}
            </Link>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="py-16 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-black mb-12">Why Choose EcoFinds?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">Eco-Friendly</h3>
                <p className="text-gray-600">All our products are carefully selected for their environmental impact</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">Fast Delivery</h3>
                <p className="text-gray-600">Quick and reliable delivery with eco-friendly packaging</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black">Best Prices</h3>
                <p className="text-gray-600">Competitive prices on all sustainable products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render CartTab */}
      <CartTab />
    </div>
  );
}

export default Homescene;