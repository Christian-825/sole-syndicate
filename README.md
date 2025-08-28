# Sole Syndicate - Capstone 3

Sole Syndicate is a full-stack e-commerce web application built for sneaker enthusiasts. It enables users to create accounts, browse products, search for their favorite shoes, and manage their shopping cart with ease. On the administrative side, the platform includes a dashboard that allows admins to manage inventory and track customer orders, giving them full control over the store. The application delivers a seamless, engaging shopping experience while keeping inventory and order management simple and efficient for administrators.

## Features

### User Functionality
- **User Accounts:** Securely sign up, log in, and manage your profile.
- **Homepage:** User-friendly landing page offering fast access to featured sneakers, latest releases, and special offers
- **Product Catalog:** Explore all available sneakers with detailed descriptions, prices, and images.
- **Product Search:** Find sneakers easily by name or category.
- **Shopping Cart:** Add items, adjust quantities, and remove products before checkout.
- **Order Management:** Place orders, track status, and view order history.

### Admin Dashboard
  - **Add new sneaker products** with images and details
  - **Activate or archive** specific products
  - **Update or remove** existing products
  - **Monitor and manage** customer orders

## Run the Project

### Install dependencies

```sh
npm install
```

### Start Development Server

```sh
npm run dev
```

### Build for Production

```sh
npm run build
```

## API Endpoints

### Users
- `POST /users/register` — Register a new user  
- `POST /users/login` — User login  

### Products
- `GET products/all` — List all sneakers  
- `GET /products/:id` — Get sneaker details  
- `POST /products` — Add a new sneaker (Admin only)  
- `PUT /products/:productId/update` — Update a sneaker (Admin only)  
- `DELETE /products/:productId` — Remove a sneaker (Admin only) 

## Cart
- `GET /cart/get-cart` — Get the current user's cart  
- `POST /cart/add-to-cart` — Add an item to the cart  
- `PATCH /cart/update-cart-quantity` — Update quantity of an item in the cart  
- `DELETE /cart/:itemId` — Remove a specific item from the cart  

### Orders

- `POST /orders/checkout` — Place a new order  
- `GET /orders/my-orders` — View your orders  
- `GET /orders/all-orders` — View all orders (admin only)  
- `PATCH /orders/:id` — Update order status (admin only)  
- `DELETE /orders/:id` — Delete an order (admin only)  

## Technologies Used

- **Frontend:** Vue 3, Vite, Bootstrap, Bootstrap Icons, Notyf  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT, bcrypt  
- **State Management:** Pinia (Vue state management)  
- **Routing:** Vue Router  
- **HTTP Requests / API Communication:** Axios  
- **Deployment:** Vercel / AWS