import React, { useState, useEffect } from 'react';
import ProductCart from '../components/ProductCart';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiService } from '../services/api';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Electronics = () => {
    const location = useLocation();
    const searchQuery = useSelector(store => store.search.searchQuery);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await apiService.getElectronics();
                setProducts(response.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch electronics items');
                console.error('Error fetching electronics items:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className='min-h-screen bg-white'>
                <Navbar />
                <Header />
                <div className='flex justify-center items-center h-screen'>
                    <div className='text-black text-xl'>Loading...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen bg-white'>
                <Navbar />
                <Header />
                <div className='flex justify-center items-center h-screen'>
                    <div className='text-red-500 text-xl'>{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-white'>
            <Navbar />
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className='text-3xl font-bold text-center mb-10 text-black'>Electronics Items</h1>
                <div className='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8'>
                    {filteredProducts.map((product, key) =>
                        <ProductCart
                            key={key}
                            data={product}
                            basePath="/electronics"
                            source="electronics"
                        />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Electronics;
