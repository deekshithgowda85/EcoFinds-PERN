const express = require('express');
const router = express.Router();
const { Product, Electronics } = require('../models/Product');
const { upload, uploadToSupabase, deleteFromSupabase, extractFileNameFromUrl } = require('../utils/supabaseStorage');

// Product Routes
router.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/products', upload, async (req, res) => {
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

router.put('/products/:id', upload, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        let imageUrl = product.image; // Keep existing image by default
        
        // Upload new image to Supabase if file is provided
        if (req.file) {
            const uploadResult = await uploadToSupabase(req.file, 'products');
            imageUrl = uploadResult.url;
            
            // Delete old image from Supabase
            if (product.image && product.image.includes('supabase.co')) {
                try {
                    const oldFileName = extractFileNameFromUrl(product.image);
                    if (oldFileName) {
                        await deleteFromSupabase(oldFileName);
                    }
                } catch (deleteError) {
                    console.error('Error deleting old image:', deleteError);
                }
            }
        }
        
        const updateData = {
            ...req.body,
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

router.post('/electronics', upload, async (req, res) => {
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

router.put('/electronics/:id', upload, async (req, res) => {
    try {
        const electronics = await Electronics.findByPk(req.params.id);
        if (!electronics) return res.status(404).json({ message: 'Electronics item not found' });
        
        let imageUrl = electronics.image; // Keep existing image by default
        
        // Upload new image to Supabase if file is provided
        if (req.file) {
            const uploadResult = await uploadToSupabase(req.file, 'electronics');
            imageUrl = uploadResult.url;
            
            // Delete old image from Supabase
            if (electronics.image && electronics.image.includes('supabase.co')) {
                try {
                    const oldFileName = extractFileNameFromUrl(electronics.image);
                    if (oldFileName) {
                        await deleteFromSupabase(oldFileName);
                    }
                } catch (deleteError) {
                    console.error('Error deleting old image:', deleteError);
                }
            }
        }
        
        const updateData = {
            ...req.body,
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