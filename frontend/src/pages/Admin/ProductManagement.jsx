import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import axios from 'axios';
import supabaseStorageService from '../../services/supabaseStorage';

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
                // Validate file first
                supabaseStorageService.validateFile(file);
                
                setSelectedFile(file);
                setUploading(true);
                
                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
                
                // Upload to Supabase Storage
                const folderName = selectedProduct || selectedElectronic ? 
                    (selectedProduct ? 'products' : 'electronics') : 'products';
                    
                const uploadResult = await supabaseStorageService.uploadFile(file, folderName);
                
                setFormData(prev => ({
                    ...prev,
                    image: uploadResult.url
                }));
                
                console.log('File uploaded successfully:', uploadResult.url);
                
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
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {products.map(product => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-20 w-20 object-cover rounded-lg shadow-sm"
                                                        onError={(e) => {
                                                            console.error('Image failed to load:', product.image);
                                                            e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 overflow-hidden text-ellipsis max-w-sm">{product.description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEdit(product, 'product')}
                                                        className="text-blue-600 hover:text-blue-800 mr-4 font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id, 'product')}
                                                        className="text-red-600 hover:text-red-800 font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {electronics.map(electronic => (
                                            <tr key={electronic.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <img
                                                        src={electronic.image}
                                                        alt={electronic.name}
                                                        className="h-20 w-20 object-cover rounded-lg shadow-sm"
                                                        onError={(e) => {
                                                            console.error('Image failed to load:', electronic.image);
                                                            e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                                                        }}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{electronic.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${electronic.price}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 overflow-hidden text-ellipsis max-w-sm">{electronic.description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEdit(electronic, 'electronics')}
                                                        className="text-blue-600 hover:text-blue-800 mr-4 font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(electronic.id, 'electronics')}
                                                        className="text-red-600 hover:text-red-800 font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProductManagement; 