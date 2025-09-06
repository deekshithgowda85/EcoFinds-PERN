# Firebase Storage Setup for Frontend (Browser)

## Overview

This guide will help you set up Firebase Storage in your React frontend to handle image uploads directly from the browser. This approach gives you more control and reduces server load.

## Step 1: Install Firebase SDK

First, install the Firebase SDK for web:

```bash
npm install firebase
```

## Step 2: Create Firebase Configuration

Create a Firebase configuration file:

```javascript
// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Firebase Auth (if you want to use Firebase Auth)
export const auth = getAuth(app);

export default app;
```

## Step 3: Create Firebase Storage Service

Create a service to handle Firebase Storage operations:

```javascript
// src/services/firebaseStorage.js
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../config/firebase";

class FirebaseStorageService {
  // Upload file to Firebase Storage
  async uploadFile(file, folder = "images") {
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${Math.random()
        .toString(36)
        .substr(2, 9)}.${file.name.split(".").pop()}`;
      const storagePath = `${folder}/${filename}`;

      // Create storage reference
      const storageRef = ref(storage, storagePath);

      // Upload file
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Progress monitoring (optional)
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Upload error:", error);
            reject(error);
          },
          async () => {
            // Upload completed successfully
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                url: downloadURL,
                path: storagePath,
                filename: filename,
              });
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  // Delete file from Firebase Storage
  async deleteFile(filePath) {
    try {
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
      console.log("File deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files, folder = "images") {
    try {
      const uploadPromises = Array.from(files).map((file) =>
        this.uploadFile(file, folder)
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading multiple files:", error);
      throw error;
    }
  }

  // Validate file before upload
  validateFile(file, maxSize = 5 * 1024 * 1024) {
    // 5MB default
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Only JPG, PNG, GIF, and WebP are allowed."
      );
    }

    if (file.size > maxSize) {
      throw new Error(
        `File size too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`
      );
    }

    return true;
  }
}

export default new FirebaseStorageService();
```

## Step 4: Create Image Upload Component

Create a React component for image uploads:

```javascript
// src/components/ImageUpload.jsx
import React, { useState } from "react";
import firebaseStorageService from "../services/firebaseStorage";

const ImageUpload = ({
  onUploadSuccess,
  onUploadError,
  folder = "products",
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file
      try {
        firebaseStorageService.validateFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);

        // Upload file
        handleUpload(file);
      } catch (error) {
        onUploadError && onUploadError(error.message);
      }
    }
  };

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const result = await firebaseStorageService.uploadFile(file, folder);
      onUploadSuccess && onUploadSuccess(result);
    } catch (error) {
      onUploadError && onUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
        className="file-input"
      />

      {uploading && (
        <div className="upload-progress">
          <p>Uploading...</p>
        </div>
      )}

      {preview && (
        <div className="preview">
          <img
            src={preview}
            alt="Preview"
            style={{ maxWidth: "200px", maxHeight: "200px" }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
```

## Step 5: Update Your API Service

Update your API service to work with Firebase URLs:

```javascript
// Add to src/services/api.js

// Product services with Firebase Storage
export const productService = {
  // Create product with image
  createProduct: async (productData) => {
    try {
      const response = await api.post("/products/products", {
        ...productData,
        // Image URL will come from Firebase Storage
      });
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Update product with new image
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },
};
```

## Step 6: Environment Variables

Create a `.env` file in your frontend root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Then update your Firebase config:

```javascript
// src/config/firebase.js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

## Step 7: Usage Example

Here's how to use the image upload in a form:

```javascript
// src/components/ProductForm.jsx
import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import { apiService } from "../services/api";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  const handleImageUpload = (result) => {
    setFormData((prev) => ({
      ...prev,
      image: result.url, // Use the Firebase Storage URL
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createProduct(formData);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Product Name"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
      />

      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, price: e.target.value }))
        }
      />

      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
        }
      />

      <ImageUpload
        onUploadSuccess={handleImageUpload}
        onUploadError={(error) => console.error(error)}
        folder="products"
      />

      <button type="submit">Create Product</button>
    </form>
  );
};

export default ProductForm;
```

## Step 8: Firebase Security Rules

Update your Firebase Storage security rules:

```javascript
// Firebase Console > Storage > Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }

    // Allow write access to authenticated users only
    match /{allPaths=**} {
      allow write: if request.auth != null;
    }
  }
}
```

## Benefits of Client-Side Upload

✅ **Reduced Server Load**: Images upload directly to Firebase
✅ **Better User Experience**: Real-time progress tracking
✅ **Scalability**: No server storage limitations
✅ **Cost Effective**: Reduce server bandwidth usage
✅ **Global CDN**: Firebase Storage provides global content delivery

## Important Notes

- **Security**: Client-side uploads require proper Firebase security rules
- **Validation**: Always validate files on both client and server
- **Error Handling**: Implement proper error handling for network issues
- **File Cleanup**: Consider implementing cleanup for unused files
- **Authentication**: Use Firebase Auth or implement your own auth checks

## Troubleshooting

1. **CORS Issues**: Make sure your domain is added to Firebase authorized domains
2. **Security Rules**: Ensure your storage rules allow uploads
3. **File Size**: Check Firebase Storage quotas and limits
4. **Environment Variables**: Verify all Vite environment variables are correctly set
