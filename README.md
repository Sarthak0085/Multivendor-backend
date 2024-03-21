# Multivendor Ecommerce Backend

This is a backend project for a Multivendor Ecommerce application built using Node.js, Express, MongoDB, and TypeScript. It provides APIs for various functionalities required in a multivendor ecommerce platform.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [License](#license)

## User Features:

- **User Authentication**: Register and login with OTP verification.
- **Product Interaction**: View, wishlist, cart, checkout.
- **Profile Management**: Update details, addresses, profile picture and able to change password.
- **Order Management**: View all orders, refunds orders, order details and review products.
- **Password Reset**: Reset password with OTP.

## Seller Features:

- **Seller Authentication**: Register and login with OTP verification.
- **Dashboard**: Access a personalized dashboard.
- **Product Management**: Create, update, read, and delete products.
- **Event Management**: Create and delete events.
- **Order Tracking**: Monitor and manage orders and also able to refund orders.
- **Coupon Creation**: Generate promotional coupons.
- **Financial Management**: Withdraw earnings and update shop settings.
- **Profile Management**: Update profile information like picture and other info.
- **Password Reset**: Reset password with OTP.

## Admin Features:

- **Admin Dashboard**: Access a Admin Dashboard.
- **Product and Event Management**: read and delete products and events.
- **Category Management**: Manage categories, brands, colors, sizes.
- **Profile Management**: Update admin profile and perform administrative tasks.
- **User and Seller Management**: View and manage user and seller details, including blocking users and sellers
- **CRUD Operations**: Perform CRUD operations on categories, sizes, colors, and brands.
- **FAQ and Banner Management**: Update FAQ content and edit banner images.
- **Coupon Management**: View, create, and delete coupons.
- **Withdraw Request Handling**: Manage and update withdrawal requests.
- **Order Management**: View all orders, including refunds, with detailed information.
- **Analytics**: Access analytics on orders, products, events, users, sellers, and coupons.

## Prerequisites

- Node.js (20.0)

## Installation

1. Clone the repository: `git clone https://github.com/Sarthak0085/Multivendor-backend.git`
2. Navigate to the project directory: `cd Multivendor-backend`
3. Create a `.env` file in the root directory and add your environment variables (Take exmaple from the `.env.example`).
4. Install dependencies: `npm install`

## Usage

1. Start the development server: `npm run start`
2. The backend server will be running at `http://localhost:4000`

## Project Structure

- `src/` - Contains the TypeScript source code for the backend application
- `dist/` - Contains the compiled JavaScript files (output directory)

## License

This project is licensed under the [MIT License](LICENSE).
