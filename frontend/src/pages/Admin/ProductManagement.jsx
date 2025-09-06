import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import axios from 'axios';
import Footer from '../../components/Footer';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [electronics, setElectronics] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedElectronic, setSelectedElectronic] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: '',
        description: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Fetch products and electronics on component mount
    useEffect(() => {
        fetchProducts();
        fetchElectronics();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products/products');
            console.log('Products data:', response.data);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchElectronics = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products/electronics');
            console.log('Electronics data:', response.data);
            setElectronics(response.data);
        } catch (error) {
            console.error('Error fetching electronics items:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Validate file size and type
                const maxSize = 5 * 1024 * 1024; // 5MB
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                
                if (!allowedTypes.includes(file.type)) {
                    throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
                }
                
                if (file.size > maxSize) {
                    throw new Error(`File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
                }
                
                setSelectedFile(file);
                setUploading(true);
                
                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
                
                // Upload to backend API which handles Supabase
                const formData = new FormData();
                formData.append('image', file);
                
                const response = await axios.post('http://localhost:5000/api/products/upload-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                
                const imageUrl = response.data.imageUrl;
                
                setFormData(prev => ({
                    ...prev,
                    image: imageUrl
                }));
                
                console.log('File uploaded successfully:', imageUrl);
                
            } catch (error) {
                console.error('Error uploading file:', error);
                alert(`Upload failed: ${error.message}`);
                // Reset file input on error
                e.target.value = '';
                setSelectedFile(null);
                setImagePreview(null);
            } finally {
                setUploading(false);
            }
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                name: formData.name,
                price: formData.price,
                description: formData.description,
                image: formData.image // This will be the Supabase URL
            };

            if (selectedProduct) {
                await axios.put(`http://localhost:5000/api/products/products/${selectedProduct.id}`, productData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                await axios.post('http://localhost:5000/api/products/products', productData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            fetchProducts();
            resetForm();
            alert(selectedProduct ? 'Product updated successfully!' : 'Product created successfully!');
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error saving product. Please try again.');
        }
    };

    const handleElectronicsSubmit = async (e) => {
        e.preventDefault();
        try {
            const electronicsData = {
                name: formData.name,
                price: formData.price,
                description: formData.description,
                image: formData.image // This will be the Supabase URL
            };

            if (selectedElectronic) {
                await axios.put(`http://localhost:5000/api/products/electronics/${selectedElectronic.id}`, electronicsData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                await axios.post('http://localhost:5000/api/products/electronics', electronicsData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            fetchElectronics();
            resetForm();
            alert(selectedElectronic ? 'Electronics item updated successfully!' : 'Electronics item created successfully!');
        } catch (error) {
            console.error('Error saving electronics item:', error);
            alert('Error saving electronics item. Please try again.');
        }
    };

    const handleEdit = (item, type) => {
        if (type === 'product') {
            setSelectedProduct(item);
            setSelectedElectronic(null);
        } else {
            setSelectedElectronic(item);
            setSelectedProduct(null);
        }
        setFormData({
            name: item.name,
            price: item.price,
            image: item.image,
            description: item.description
        });
        setImagePreview(item.image);
        setSelectedFile(null);
    };

    const handleDelete = async (id, type) => {
        try {
            if (type === 'product') {
                await axios.delete(`http://localhost:5000/api/products/products/${id}`);
                fetchProducts();
            } else {
                await axios.delete(`http://localhost:5000/api/products/electronics/${id}`);
                fetchElectronics();
            }
            alert(`${type === 'product' ? 'Product' : 'Electronics item'} deleted successfully!`);
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item. Please try again.');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            image: '',
            description: ''
        });
        setSelectedProduct(null);
        setSelectedElectronic(null);
        setImagePreview(null);
        setSelectedFile(null);
        setUploading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            <AdminNavbar />
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">Product Management</h1>

                {/* Add/Edit Products Section */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-6">Products</h2>
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        <p className="text-gray-600 mb-6">Use the form below to add new products or edit existing ones.</p>
                        {/* Add/Edit Product Form */}
                        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 mb-8">
                            <h3 className="text-xl font-semibold mb-6">{selectedProduct ? 'Edit Product' : 'Add Product'}</h3>
                            <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        id="product-name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-white"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                                    <input
                                        type="number"
                                        id="product-price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-white"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="product-image" className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                                    <input
                                        type="file"
                                        id="product-image"
                                        name="image"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        disabled={uploading}
                                        className="block w-full text-gray-700 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50"
                                    />
                                    {uploading && (
                                        <div className="mt-2 text-blue-600 text-sm">
                                            Uploading image...
                                        </div>
                                    )}
                                    {imagePreview && (
                                        <div className="mt-4">
                                            <img src={imagePreview} alt="Preview" className="h-40 w-40 object-cover rounded-lg shadow-md" />
                                        </div>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        id="product-description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-white"
                                    ></textarea>
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-4">
                                    {selectedProduct && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="inline-flex justify-center py-3 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {selectedProduct ? 'Update Product' : 'Save Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        {/* Existing Products List */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="text-xl font-semibold mb-6">Existing Products</h3>
                            {products.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No products found. Add your first product above.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map(product => (
                                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                            <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-48 object-cover"
                                                    onError={(e) => {
                                                        console.error('Image failed to load:', product.image);
                                                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                                    }}
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h4 className="text-lg font-semibold text-gray-900 mb-2 truncate">{product.name}</h4>
                                                <p className="text-xl font-bold text-green-600 mb-2">${product.price}</p>
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                                                <div className="flex justify-between gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product, 'product')}
                                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors duration-200"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id, 'product')}
                                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors duration-200"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Add/Edit Electronics Section */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Electronics</h2>
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        <p className="text-gray-600 mb-6">Use the form below to add new electronics items or edit existing ones.</p>
                        {/* Add/Edit Electronics Form */}
                        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 mb-8">
                            <h3 className="text-xl font-semibold mb-6">{selectedElectronic ? 'Edit Electronics Item' : 'Add Electronics Item'}</h3>
                            <form onSubmit={handleElectronicsSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="electronics-name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        id="electronics-name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-white"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="electronics-price" className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                                    <input
                                        type="number"
                                        id="electronics-price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-white"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="electronics-image" className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                                    <input
                                        type="file"
                                        id="electronics-image"
                                        name="image"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        disabled={uploading}
                                        className="block w-full text-gray-700 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50"
                                    />
                                    {uploading && (
                                        <div className="mt-2 text-blue-600 text-sm">
                                            Uploading image...
                                        </div>
                                    )}
                                    {imagePreview && (
                                        <div className="mt-4">
                                            <img src={imagePreview} alt="Preview" className="h-40 w-40 object-cover rounded-lg shadow-md" />
                                        </div>
                                    )}
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="electronics-description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        id="electronics-description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 bg-white"
                                    ></textarea>
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-4">
                                    {selectedElectronic && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="inline-flex justify-center py-3 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {selectedElectronic ? 'Update Electronics Item' : 'Save Electronics Item'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        {/* Existing Electronics List */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="text-xl font-semibold mb-6">Existing Electronics Items</h3>
                            {electronics.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No electronics items found. Add your first electronics item above.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {electronics.map(electronic => (
                                        <div key={electronic.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                            <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200">
                                                <img
                                                    src={electronic.image}
                                                    alt={electronic.name}
                                                    className="w-full h-48 object-cover"
                                                    onError={(e) => {
                                                        console.error('Image failed to load:', electronic.image);
                                                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                                    }}
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h4 className="text-lg font-semibold text-gray-900 mb-2 truncate">{electronic.name}</h4>
                                                <p className="text-xl font-bold text-green-600 mb-2">${electronic.price}</p>
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{electronic.description}</p>
                                                <div className="flex justify-between gap-2">
                                                    <button
                                                        onClick={() => handleEdit(electronic, 'electronics')}
                                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors duration-200"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(electronic.id, 'electronics')}
                                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-lg text-sm transition-colors duration-200"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default ProductManagement; 