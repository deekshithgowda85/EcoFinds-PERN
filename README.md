# 🌱 EcoFinds - Sustainable Second-Hand Marketplace

![EcoFinds Banner](frontend/public/bannner.jpg)

> **Empowering Sustainable Consumption through a Second-Hand Marketplace**

<!-- GitHub Badges -->
<div align="center">

![GitHub stars](https://img.shields.io/github/stars/Manu77211/ecofinds?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/Manu77211/ecofinds?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/Manu77211/ecofinds?style=for-the-badge)
![GitHub license](https://img.shields.io/github/## 💡 Contact & Support

<div align="center">

**Created with ❤️ by the EcoFinds Team**

### 👥 **Project Creators**

|                                                             **Deekshith Gowda**                                                              |                                                         **Manu77211**                                                          |
| :------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: |
|                    <img src="https://github.com/deekshithgowda85.png" width="80" height="80" style="border-radius: 50%;">                    |                <img src="https://github.com/Manu77211.png" width="80" height="80" style="border-radius: 50%;">                 |
| [![GitHub](https://img.shields.io/badge/GitHub-deekshithgowda85-black?style=for-the-badge&logo=github)](https://github.com/deekshithgowda85) | [![GitHub](https://img.shields.io/badge/GitHub-Manu77211-black?style=for-the-badge&logo=github)](https://github.com/Manu77211) |

### 📧 **For questions or support, please open an issue:**

[![Deekshith's Repository](https://img.shields.io/badge/Issues-Deekshith's%20Repo-blue?style=for-the-badge&logo=github)](https://github.com/deekshithgowda85/EcoFinds-PERN/issues)
[![Manu's Repository](https://img.shields.io/badge/Issues-Manu's%20Repo-green?style=for-the-badge&logo=github)](https://github.com/Manu77211/ecofinds/issues)

**Connect with the Team:**

- 🌟 **Star** the repository to show support
- 🐛 **Report issues** for bugs or improvements
- 💬 **Discussions** for questions and ideas
- 🚀 **Fork** to contribute to the project

</div>anu77211/ecofinds?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/Manu77211/ecofinds?style=for-the-badge)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

</div>

---

## 📺 Demo Video

[![EcoFinds Demo](https://img.youtube.com/vi/NpiCPbFmqrY/maxresdefault.jpg)](https://youtu.be/NpiCPbFmqrY)

**Click the image above to watch the full demo on YouTube!**

---

## 🚀 Vision & Mission

EcoFinds revolutionizes how people buy and sell pre-owned goods, fostering a culture of sustainability by extending product lifecycles, reducing waste, and providing a convenient alternative to buying new. Our mission is to build a user-friendly platform that connects buyers and sellers, making sustainable choices easy and accessible for everyone.

---

## 🛠️ Features

- **User Authentication:** Secure registration & login
- **Profile Management:** Edit username, profile, and dashboard
- **Product Listings:** Create, view, edit, and delete listings
- **Product Browsing:** Filter by category, search by keyword
- **Product Details:** View full product info
- **Cart & Checkout:** Add to cart, view summary, place orders
- **Order History:** View previous purchases
- **Admin Dashboard:** Manage users and products (for admins)

---

## 🧑‍💻 Tech Stack

| Layer              | Technology                                                            |
| ------------------ | --------------------------------------------------------------------- |
| **Frontend**       | React, Vite, Redux Toolkit, Tailwind CSS, React Router, Framer Motion |
| **Backend**        | Node.js, Express.js, Sequelize ORM                                    |
| **Database**       | PostgreSQL (Neon), Supabase Storage                                   |
| **Authentication** | JWT, bcryptjs, Express Session                                        |
| **File Upload**    | Multer, Supabase Storage API                                          |
| **Email**          | Nodemailer (Gmail SMTP)                                               |
| **Validation**     | Express Validator                                                     |
| **Dev Tools**      | Nodemon, Vite HMR, ESLint                                             |

---

## 🏗️ System Architecture

### Complete Application Flow

```mermaid
graph TB
    subgraph "Client Side"
        A[React Frontend]
        B[Redux Store]
        C[React Router]
    end

    subgraph "Server Side"
        D[Express.js API]
        E[JWT Middleware]
        F[Multer Upload]
        G[Email Service]
    end

    subgraph "Database Layer"
        H[(Neon PostgreSQL)]
        I[Sequelize ORM]
    end

    subgraph "External Services"
        J[Supabase Storage]
        K[Gmail SMTP]
    end

    A --> D
    B --> A
    C --> A
    D --> E
    D --> F
    D --> G
    D --> I
    I --> H
    F --> J
    G --> K

    style A fill:#61DAFB
    style D fill:#68A063
    style H fill:#336791
    style J fill:#3ECF8E
```

### Database Schema (Neon PostgreSQL)

```mermaid
erDiagram
    Users {
        int id PK
        string username
        string email
        string password_hash
        string role
        timestamp created_at
        timestamp updated_at
    }

    Products {
        int id PK
        string name
        text description
        decimal price
        string image
        string category
        int user_id FK
        timestamp created_at
        timestamp updated_at
    }

    Electronics {
        int id PK
        string name
        text description
        decimal price
        string image
        string brand
        string condition
        int user_id FK
        timestamp created_at
        timestamp updated_at
    }

    Orders {
        int id PK
        int user_id FK
        decimal total_amount
        string status
        timestamp created_at
        timestamp updated_at
    }

    OrderItems {
        int id PK
        int order_id FK
        int product_id FK
        string product_type
        int quantity
        decimal price
        timestamp created_at
        timestamp updated_at
    }

    DeliveryAddresses {
        int id PK
        int order_id FK
        string name
        string email
        string phone
        text address
        string city
        string country
        timestamp created_at
        timestamp updated_at
    }

    Users ||--o{ Products : creates
    Users ||--o{ Electronics : creates
    Users ||--o{ Orders : places
    Orders ||--o{ OrderItems : contains
    Orders ||--|| DeliveryAddresses : has
    Products ||--o{ OrderItems : referenced_in
    Electronics ||--o{ OrderItems : referenced_in
```

### Supabase Storage Integration

```mermaid
graph LR
    A[Client Upload] --> B[Multer Middleware]
    B --> C[File Validation]
    C --> D[Supabase Storage API]
    D --> E[Storage Bucket: 'images']
    E --> F[Public URL Generated]
    F --> G[Database Record Updated]

    style D fill:#3ECF8E
    style E fill:#1F2937
```

---

## 📦 Project Structure

```
ecofinds/
├── 📁 frontend/                    # React application
│   ├── 📁 public/                  # Static assets
│   │   ├── bannner.jpg            # Hero banner image
│   │   ├── logo.png               # App logo
│   │   └── vite.svg               # Vite logo
│   ├── 📁 src/
│   │   ├── 📁 components/          # Reusable UI components
│   │   │   ├── CartItem.jsx       # Shopping cart item
│   │   │   ├── CartTab.jsx        # Cart sidebar
│   │   │   ├── Footer.jsx         # Page footer
│   │   │   ├── Header.jsx         # Page header
│   │   │   ├── Layout.jsx         # App layout wrapper
│   │   │   ├── MainBanner.jsx     # Hero section
│   │   │   ├── Navbar.jsx         # Navigation bar
│   │   │   └── ProductCart.jsx    # Product card
│   │   ├── 📁 pages/               # Page components
│   │   │   ├── CartSummary.jsx    # Cart overview page
│   │   │   ├── Checkout.jsx       # Payment & checkout
│   │   │   ├── Detail.jsx         # Product detail page
│   │   │   ├── Electronics.jsx    # Electronics catalog
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── Login.jsx          # User authentication
│   │   │   ├── ProductPage.jsx    # Products catalog
│   │   │   └── Register.jsx       # User registration
│   │   ├── 📁 services/            # API integrations
│   │   │   └── api.js             # Axios HTTP client
│   │   ├── 📁 stores/              # Redux state management
│   │   │   └── Cart.js            # Shopping cart store
│   │   └── 📁 assets/              # Images & icons
│   ├── package.json               # Frontend dependencies
│   ├── tailwind.config.js         # Tailwind CSS config
│   └── vite.config.js             # Vite build config
├── 📁 backend/                     # Node.js API server
│   ├── 📁 config/                  # Configuration files
│   │   └── database.js            # DB connection setup
│   ├── 📁 middleware/              # Express middleware
│   │   ├── auth.js                # JWT authentication
│   │   └── upload.js              # File upload handler
│   ├── 📁 models/                  # Sequelize data models
│   │   ├── DeliveryAddress.js     # Delivery info model
│   │   ├── Electronics.js         # Electronics model
│   │   ├── Order.js               # Order model
│   │   ├── OrderItem.js           # Order items model
│   │   ├── Product.js             # Product model
│   │   └── User.js                # User model
│   ├── 📁 routes/                  # API route handlers
│   │   ├── auth.js                # Authentication routes
│   │   ├── orders.js              # Order management
│   │   ├── products.js            # Product CRUD
│   │   └── users.js               # User management
│   ├── 📁 utils/                   # Utility functions
│   │   ├── emailService.js        # Email notifications
│   │   └── supabaseClient.js      # Supabase integration
│   ├── .env.example               # Environment template
│   ├── index.js                   # Server entry point
│   └── package.json               # Backend dependencies
├── LICENSE                        # MIT License
└── README.md                      # Documentation
```

---

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Manu77211/ecofinds.git
cd ecofinds
```

### 2. Setup Environment Variables

Create a `.env` file in the backend folder using the template below:

```ini
# Server Configuration
PORT=5000
NODE_ENV=development

# Neon PostgreSQL Database (Primary Database)
DATABASE_URL=postgresql://<username>:<password>@<host>/<database>?sslmode=require

# JWT Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Email Configuration (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=EcoFinds <your_email@gmail.com>

# Supabase Configuration (File Storage)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_STORAGE_BUCKET=images

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5173
```

#### 🔐 Environment Setup Guide:

1. **Neon Database**: Sign up at [neon.tech](https://neon.tech) and create a PostgreSQL database
2. **Supabase Storage**: Create account at [supabase.com](https://supabase.com) for file storage
3. **Gmail SMTP**: Generate app password in Gmail security settings
4. **JWT Secret**: Use a strong random string (32+ characters)

### 3. Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd ../backend
npm install
```

### 4. Initialize Database

```bash
cd backend
npm run db:init    # Initialize database tables
npm run db:sync    # Sync database schema
```

### 5. Start Development Servers

#### Backend (Terminal 1)

```bash
cd backend
npm run dev        # Starts on http://localhost:5000
```

#### Frontend (Terminal 2)

```bash
cd frontend
npm run dev        # Starts on http://localhost:5173
```

🎉 **Access the application at [http://localhost:5173](http://localhost:5173)**

---

## 🔧 Advanced Configuration

### Neon PostgreSQL Setup

1. Create account at [neon.tech](https://neon.tech)
2. Create new project and database
3. Copy connection string to `DATABASE_URL`
4. Database automatically scales and manages connections

### Supabase Storage Setup

1. Create project at [supabase.com](https://supabase.com)
2. Go to Storage → Create bucket named "images"
3. Set bucket to public access
4. Copy project URL and service role key

### Production Deployment

- **Frontend**: Deploy to Vercel, Netlify, or similar
- **Backend**: Deploy to Railway, Render, or Heroku
- **Database**: Neon automatically handles production scaling
- **Storage**: Supabase provides global CDN

---

## 🗂️ Architecture Diagrams

### High-Level System Overview

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Frontend]
        B[Redux Store]
        C[Tailwind UI]
    end

    subgraph "API Layer"
        D[Express.js Server]
        E[JWT Auth Middleware]
        F[File Upload Service]
        G[Email Service]
    end

    subgraph "Data Layer"
        H[(Neon PostgreSQL)]
        I[Sequelize ORM]
        J[Supabase Storage]
    end

    subgraph "External Services"
        K[Gmail SMTP]
        L[Neon Cloud]
        M[Supabase Cloud]
    end

    A -->|API Calls| D
    B -->|State Management| A
    C -->|Styling| A
    D -->|Authentication| E
    D -->|File Uploads| F
    D -->|Notifications| G
    E -->|Database Queries| I
    I -->|Connection| H
    F -->|File Storage| J
    G -->|Email Delivery| K
    H -->|Hosted on| L
    J -->|Hosted on| M

    style A fill:#61DAFB,color:#000
    style D fill:#68A063,color:#fff
    style H fill:#336791,color:#fff
    style J fill:#3ECF8E,color:#000
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Ways to Contribute

- 🐛 **Bug Reports**: Found a bug? Open an issue with reproduction steps
- 💡 **Feature Requests**: Have an idea? We'd love to hear it!
- 🔧 **Code Contributions**: Submit pull requests for bug fixes or features
- 📖 **Documentation**: Help improve our docs and guides
- 🎨 **Design**: UI/UX improvements and suggestions

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and ensure code quality
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Use ESLint configuration provided
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

---

## 📊 Project Stats

![GitHub Contributors](https://img.shields.io/github/contributors/Manu77211/ecofinds?style=for-the-badge)
![GitHub Commit Activity](https://img.shields.io/github/commit-activity/m/Manu77211/ecofinds?style=for-the-badge)
![GitHub Repo Size](https://img.shields.io/github/repo-size/Manu77211/ecofinds?style=for-the-badge)

---

## 🛣️ Roadmap

- [ ] **Mobile App**: React Native mobile application
- [ ] **Payment Integration**: Stripe/PayPal payment processing
- [ ] **Real-time Chat**: Buyer-seller messaging system
- [ ] **Review System**: Product ratings and reviews
- [ ] **Advanced Search**: Elasticsearch integration
- [ ] **Social Features**: User profiles and following
- [ ] **Multi-language**: Internationalization support

---

## 🏆 Acknowledgments

- **Neon**: For providing serverless PostgreSQL database
- **Supabase**: For file storage and additional backend services
- **Tailwind CSS**: For the beautiful and responsive UI
- **React Community**: For the amazing ecosystem and tools

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Show Your Support

If you found this project helpful, please consider:

- ⭐ **Starring** the repository
- 🍴 **Forking** for your own projects
- 📢 **Sharing** with the community
- 🐛 **Reporting** any issues you find

---

## � Contributors & Credits

### 🤝 **Project Contributors**

<div align="center">

| Avatar                                                                                                 | Contributor         | GitHub Profile                                                                                                                      |
| ------------------------------------------------------------------------------------------------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://github.com/Manu77211.png" width="50" height="50" style="border-radius: 50%;">        | **Manu77211**       | [![GitHub](https://img.shields.io/badge/GitHub-Manu77211-black?style=flat&logo=github)](https://github.com/Manu77211)               |
| <img src="https://github.com/devbharu.png" width="50" height="50" style="border-radius: 50%;">         | **devbharu**        | [![GitHub](https://img.shields.io/badge/GitHub-devbharu-black?style=flat&logo=github)](https://github.com/devbharu)                 |
| <img src="https://github.com/deekshithgowda85.png" width="50" height="50" style="border-radius: 50%;"> | **Deekshith Gowda** | [![GitHub](https://img.shields.io/badge/GitHub-deekshithgowda85-black?style=flat&logo=github)](https://github.com/deekshithgowda85) |

</div>

### 🌟 **Special Thanks**

We extend our gratitude to:

- **🧠 AI Assistant**: For development guidance and code optimization
- **🎨 Design Inspiration**: Modern e-commerce platforms and sustainable marketplace concepts
- **📚 Learning Resources**: React, Node.js, and PostgreSQL communities
- **🔧 Tool Providers**: GitHub, Neon, Supabase, and all open-source libraries used

### 🎯 **Want to Contribute?**

We welcome new contributors! Here's how you can help:

1. **🐛 Bug Reports**: Found an issue? [Open an issue](https://github.com/deekshithgowda85/EcoFinds-PERN/issues)
2. **💡 Feature Requests**: Have ideas? We'd love to hear them!
3. **🔧 Code Contributions**: Fork, develop, and submit a pull request
4. **📖 Documentation**: Help improve our guides and documentation
5. **🎨 Design**: UI/UX improvements and suggestions

### 📊 **Contribution Stats**

![Contributors](https://img.shields.io/github/contributors/deekshithgowda85/EcoFinds-PERN?style=for-the-badge)
![Commits](https://img.shields.io/github/commit-activity/m/deekshithgowda85/EcoFinds-PERN?style=for-the-badge)
![Last Commit](https://img.shields.io/github/last-commit/deekshithgowda85/EcoFinds-PERN?style=for-the-badge)

---

## �💡 Contact & Support

<div align="center">

📧 For questions or support, please [open an issue](https://github.com/Manu77211/ecofinds/issues)
or
please [open an issue](https://github.com/deekshithgowda85/EcoFinds-PERN/issues)

</div>
