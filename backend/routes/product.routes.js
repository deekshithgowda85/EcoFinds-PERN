const express = require('express');
const router = express.Router();
const { Product, Electronics } = require('../models/Product');
const { upload, uploadToSupabase, deleteFromSupabase, extractFileNameFromUrl } = require('../utils/supabaseStorage');

// Image upload endpoint
router.post('/upload-image', upload, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload to Supabase
        const uploadResult = await uploadToSupabase(req.file, 'products');
        
        res.json({
            success: true,
            imageUrl: uploadResult.url,
            fileName: uploadResult.fileName,
            message: 'Image uploaded successfully'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Upload failed: ' + error.message 
        });
    }
});

// Product Routes
router.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/products', async (req, res) => {
    try {
        const productData = {
            name: req.body.name,
            price: parseFloat(req.body.price),
            description: req.body.description,
            image: req.body.image // Should be a Supabase URL from separate upload
        };
        
        const product = await Product.create(productData);
        res.status(201).json(product);
    } catch (error) {
        console.error('Product creation error:', error);
        res.status(400).json({ message: error.message });
    }
});

// Legacy endpoint for direct file upload (keeping for backward compatibility)
router.post('/products-with-upload', upload, async (req, res) => {
    try {
        let imageUrl = null;
        
        // Upload image to Supabase if file is provided
        if (req.file) {
            const uploadResult = await uploadToSupabase(req.file, 'products');
            imageUrl = uploadResult.url;
        }
        
        const productData = {
            ...req.body,
            image: imageUrl
        };
        
        const product = await Product.create(productData);
        res.status(201).json(product);
    } catch (error) {
        console.error('Product creation error:', error);
        res.status(400).json({ message: error.message });
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        // Handle image update if new image URL is provided
        let imageUrl = req.body.image || product.image; // Use new image URL or keep existing
        
        const updateData = {
            name: req.body.name || product.name,
            price: req.body.price ? parseFloat(req.body.price) : product.price,
            description: req.body.description || product.description,
            image: imageUrl
        };
        
        await product.update(updateData);
        res.json(product);
    } catch (error) {
        console.error('Product update error:', error);
        res.status(400).json({ message: error.message });
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        // Delete image from Supabase if it exists
        if (product.image && product.image.includes('supabase.co')) {
            try {
                const fileName = extractFileNameFromUrl(product.image);
                if (fileName) {
                    await deleteFromSupabase(fileName);
                }
            } catch (deleteError) {
                console.error('Error deleting image:', deleteError);
            }
        }
        
        await product.destroy();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Electronics Routes
router.get('/electronics', async (req, res) => {
    try {
        const electronics = await Electronics.findAll();
        res.json(electronics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/electronics', async (req, res) => {
    try {
        const electronicsData = {
            name: req.body.name,
            price: parseFloat(req.body.price),
            description: req.body.description,
            image: req.body.image // Should be a Supabase URL from separate upload
        };
        
        const electronics = await Electronics.create(electronicsData);
        res.status(201).json(electronics);
    } catch (error) {
        console.error('Electronics creation error:', error);
        res.status(400).json({ message: error.message });
    }
});

// Legacy endpoint for direct file upload (keeping for backward compatibility)
router.post('/electronics-with-upload', upload, async (req, res) => {
    try {
        let imageUrl = null;
        
        // Upload image to Supabase if file is provided
        if (req.file) {
            const uploadResult = await uploadToSupabase(req.file, 'electronics');
            imageUrl = uploadResult.url;
        }
        
        const electronicsData = {
            ...req.body,
            image: imageUrl
        };
        
        const electronics = await Electronics.create(electronicsData);
        res.status(201).json(electronics);
    } catch (error) {
        console.error('Electronics creation error:', error);
        res.status(400).json({ message: error.message });
    }
});

router.get('/electronics/:id', async (req, res) => {
    try {
        const electronics = await Electronics.findByPk(req.params.id);
        if (!electronics) return res.status(404).json({ message: 'Electronics item not found' });
        res.json(electronics);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/electronics/:id', async (req, res) => {
    try {
        const electronics = await Electronics.findByPk(req.params.id);
        if (!electronics) return res.status(404).json({ message: 'Electronics item not found' });
        
        // Handle image update if new image URL is provided
        let imageUrl = req.body.image || electronics.image; // Use new image URL or keep existing
        
        const updateData = {
            name: req.body.name || electronics.name,
            price: req.body.price ? parseFloat(req.body.price) : electronics.price,
            description: req.body.description || electronics.description,
            image: imageUrl
        };
        
        await electronics.update(updateData);
        res.json(electronics);
    } catch (error) {
        console.error('Electronics update error:', error);
        res.status(400).json({ message: error.message });
    }
});

router.delete('/electronics/:id', async (req, res) => {
    try {
        const electronics = await Electronics.findByPk(req.params.id);
        if (!electronics) return res.status(404).json({ message: 'Electronics item not found' });
        
        // Delete image from Supabase if it exists
        if (electronics.image && electronics.image.includes('supabase.co')) {
            try {
                const fileName = extractFileNameFromUrl(electronics.image);
                if (fileName) {
                    await deleteFromSupabase(fileName);
                }
            } catch (deleteError) {
                console.error('Error deleting image:', deleteError);
            }
        }
        
        await electronics.destroy();
        res.json({ message: 'Electronics item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 