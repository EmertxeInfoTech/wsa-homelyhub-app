# WSA HomelyHub Application

**HomelyHub** is a full-stack **hotel booking web application** inspired by Airbnb, built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) with payment integration via **Razorpay** and cloud image storage via **ImageKit**.  
It allows users to browse properties, search/filter listings, book stays, manage bookings, and even list their own properties.

---

## 🛠️ Tech Stack

<p align="left">
  <img src="https://cdn.worldvectorlogo.com/logos/react-2.svg" alt="React" height="40"/>
  <img src="https://cdn.worldvectorlogo.com/logos/redux.svg" alt="Redux Toolkit" height="40"/>
  <img src="https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg" alt="Node.js" height="40"/>
  <img src="https://cdn.worldvectorlogo.com/logos/express-109.svg" alt="Express.js" height="40"/>
  <img src="https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg" alt="MongoDB" height="40"/>
  <img src="https://cdn.worldvectorlogo.com/logos/css-3.svg" alt="CSS3" height="40"/>
  <img src="https://cdn.worldvectorlogo.com/logos/gsap-greensock.svg" alt="GSAP" height="50"/>
  <img src="https://cdn.brandfetch.io/id8c1BII23/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B" alt="ImageKit" height="20"/>
  <img src="https://cdn.worldvectorlogo.com/logos/razorpay.svg" alt="Razorpay" width="90" height="90"/>
</p>

---

## ✨ Key Features

- **JWT Authentication** – Secure user login & signup
- **Property Listings** – Users can add new properties with images
- **Search & Filters** – Find properties by location, price, or type
- **Booking History** – View past and upcoming bookings
- **Redux Toolkit** – Global state management
- **Razorpay Integration** – Secure online payments for bookings
- **ImageKit Integration** – Cloud storage for property images
- **GSAP Animations** – Smooth property card animations
- **Mailtrap** - Email notifications using mailtrap

---
## Screenshot:
![App Screenshot](frontend/public/readme/wsa-homelyhub-app-screenshot.jpg)

 **Live Demo** : [Click here to view the app](https://wsa-homelyhub-app.netlify.app/)


---
## 📁 Folder Structure
├── frontend<br>
└── backend

- **frontend/** → React.js application (UI, Redux, GSAP animations, API integration)  
- **backend/** → Node.js & Express server (API endpoints, JWT auth, Razorpay, ImageKit integration, MongoDB models)  

---

## 📌 How to Run Locally

1️⃣ **Clone the Repository:**
```bash
git clone <REPOSITORY_URL>
cd homelyhub
```
2️⃣ Install Dependencies:
```
# Frontend
cd frontend
npm install
```
3️⃣ Configure Environment Variables:
```
# Backend
cd ../backend
npm install
```
4️⃣ Backend (.env)
```
# Server
PORT=8000
MONGO_URI=mongodb://localhost:27017/homelyhub
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# ImageKit
IMAGEKIT_PUBLICKEY==your_imagekit_public_key
IMAGEKIT_PRIVATEKEY==your_imagekit_private_key
IMAGEKIT_URLENDPOINT==your_imagekit_url_endpoint

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret

# Mailtrap
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
```
5️⃣ Frontend (.env)
```
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_RAZORPAY_KEY=your_razorpay_key
```
6️⃣ Run the Application:
```
# Backend
cd backend
npm start

# Frontend
cd ../frontend
npm start
```
## 📄 License
© 2023 WSA. All rights reserved.
