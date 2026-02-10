# 🤝 Team Collaboration Guide

Establish a smooth workflow for the **E-Commerce Node.js Project**. This guide explains the core structure, essential utilities, and the lifecycle of a request so everyone stays on the same page.

---

## 🏗️ Project Architecture

We follow a **Modular Architecture**. Each feature (User, Auth, Product, Cart) has its own folder in `src/modules/`.

### 📂 Module Structure

Inside each module (e.g., `src/modules/Product/`), you will find three key files:

1.  **`product.controller.js`**:
    - **Role**: The entry point. It defines the routes (e.g., `router.post('/create')`).
    - **Responsibility**: Receives the request, calls middlewares (validation, auth), and passes control to the service.
2.  **`product.service.js`**:
    - **Role**: The brain 🧠.
    - **Responsibility**: Contains the actual business logic. It talks to the database (Mongoose models), handles calculations, and sends the final response.
3.  **`product.validation.js`**:
    - **Role**: The gatekeeper 🛡️.
    - **Responsibility**: Defines Joi schemas to ensure the data coming in (body, query, params) is correct before it reaches the controller.

---

## 🛡️ Core Middlewares Explained

These are the "security guards" that run before your service function.

### 1. `asyncHandler`

- **What it is**: A wrapper for all async controller/service functions.
- **Why use it**: It automatically catches errors (like DB connection failure) and sends them to the global error handler, so your server doesn't crash.
- **Usage**: `asyncHandler(myServiceFunction)`

### 2. `validation(schema)`

- **What it is**: Checks if the request data matches your Joi schema.
- **How it works**: It merges `req.body`, `req.query`, and `req.params` into one object and validates it.
- **If Valid**: Calls `next()` to proceed.
- **If Invalid**: Returns a 400 error with details.

### 3. `isAuthenticated` & `isAuthorized`

- **`isAuthenticated`**: Checks the `token` in headers. If valid, attaches the user to `req.user`.
- **`isAuthorized(role)`**: Checks if `req.user.role` matches the allowed roles (e.g., Admin, Seller).

---

## 🔧 Essential Utilities (Toolbox)

Don't reinvent the wheel! Use these existing tools in `src/utils/`:

- **`enums/enums.js`**: **Crucial!** Import roles, order statuses, etc. from here. Do not hardcode strings like "pending" or "admin".
- **`error handling/globalHandler.js`**: The final destination for all errors. Returns a clean JSON error response.
- **`email/sendEmail.js`**: Sends emails using Nodemailer (Gmail).
- **`multer/cloudUpload.js`**: Handles file uploads to Cloudinary.

---

## 🔄 Request Workflow: Life of an API Call

Let's trace what happens when a user sends a **POST /register** request.

1.  **Router (`auth.controller.js`)**:
    The request hits `router.post('/register', validation(schema), asyncHandler(service))`.

2.  **Validation Middleware**:
    - Checks: "Is email valid? Is password strong?"
    - Pass: Goes to next step.
    - Fail: Helper returns `400 Bad Request`.

3.  **Service Function (`auth.service.js`)**:
    - **Input**: Receives validated `req.body`.
    - **Logic**:
      - Checks DB: "Does this email exist?" (`User.findOne`)
      - Hashes Password: `hash(password)`
      - Creates User: `User.create({...})`
      - Sends Email: `emailEvent.emit(...)`
    - **Response**: `return res.status(201).json({ message: "Success" })`

4.  **Error Handling (if something breaks)**:
    If DB fails, `asyncHandler` catches the error and sends it to `globalHandler`, which returns `500 Internal Server Error` to the user.

---

## 📝 Git Workflow for Collaboration

1.  **Pull First**: Always `git pull origin main` before starting work to get the latest models/utils.
2.  **Create Branch**: `git checkout -b feature/my-feature-name`.
3.  **Commit Often**: `git commit -m "feat: add product search"`.
4.  **Push**: `git push origin feature/my-feature-name`.
5.  **Environment**: Ensure your `.env` file matches the team's config (ask for the keys!).

---

> **Tip**: Keep your `service` functions clean. If you are doing the same logic twice (like calculating price), move it to a helper function!
