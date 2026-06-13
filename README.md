# Rent & Sell Web App

##  Overview
A full-stack web application that allows users to rent or sell properties, search listings, and communicate with property owners. The system includes role-based dashboards for Customers, Owners, and Admins.

---

##  Features

- User authentication (login / signup)
- Role-based access control (Customer, Owner, Admin)
- Create, edit, and delete property listings
- Advanced property search and filtering
- Favorites system
- Messaging system between users
- Transaction tracking
- Admin dashboard for full system management

---

##  User Roles

###  Customer
- Browse all properties
- Save favorites
- View messages
- View transactions
- Manage profile

###  Owner
- Create and manage properties
- View messages from users
- Track transactions
- Manage profile

### 🛠 Admin
- Manage all users
- Manage all properties
- View all messages
- View all transactions
- Filter properties by:
  - Rent / Sell
  - Price range
  - Bedrooms / Bathrooms
  - Location
  - Property type

---

## 🛠 Tech Stack

- Frontend: React + Vite
- Backend: FastAPI
- Database: SQLite (development)
- Authentication: Email & Password
- Email Service: SMTP (Gmail)

---

##  Project Structure

```txt
frontend/
backend/
```
## Clone repo
```bash
git clone https://github.com/keanghongtang-afk/Rent-n-Sell-estate-web-page.git
```

## Backend Setup 

### Install uv (if not installed)
https://docs.astral.sh/uv/getting-started/installation/

Then open terminal:

```bash
cd backend
uv sync
uv run python main.py
```

run this in terminal will make backend run at:
```
http://localhost:8000
```

## Frontend Setup

### Install dependencies

```bash
npm install
```

### Run Frontend
```bash
npm run dev
```

Frontend will run at:
```
https://localhost:5173
```

## Environment Variable

### Backend

Create a ```.env``` file inside the ```backend``` folder:

```txt
EMAIL_ADDRESS=[EMAIL_ADDRESS]
EMAIL_PASSWORD=[PASSWORD]
```

Note: Gmail requires an App Password for SMTP authentication.

This is where you can get the EMAIL_PASSWORD

https://myaccount.google.com/apppasswords

### Frontend

Create ```.env``` file in ```rent-and-sell``` folder:

```txt
VITE_API_URL=http://localhost:8000
```

## Demo

- [Video Demo](demo.mp4) (This is the First Demo of this project, I will update the new demo with all of the new features, UI changes and etc.. soon)

