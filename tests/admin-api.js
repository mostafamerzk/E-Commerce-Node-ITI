import axios from "axios";

// ─── CONFIG ────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:3000/admin";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OTVjM2U5OTFjODIzYTljMTkzZTFlMCIsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJpYXQiOjE3NzE0MjI3MDksImV4cCI6MTc3MTUwOTEwOX0.6eh81aMlHhpH2cLpvnF9Wj6D63sIM62TnhMIyXtp-l4";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

// ─── HELPER ────────────────────────────────────────────────────────────────
function log(label, data) {
  console.log(`\n──────── ${label} ────────`);
  console.log(JSON.stringify(data, null, 2));
}

// ═══════════════════════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════════════════════

async function getAllUsers({ search = "", page = 1, limit = 10 } = {}) {
  const res = await api.get("/users", { params: { search, page, limit } });
  log("GET ALL USERS", res.data);
  return res.data;
}

async function getUserById(userId) {
  console.log("user by ID")
  const res = await api.get(`/users/${userId}`);
  log("GET USER BY ID", res.data);
  return res.data;
}

async function restrictUser(userId) {
  const res = await api.patch(`/users/${userId}/restrict`);
  log("RESTRICT USER", res.data);
  return res.data;
}

async function approveUser(userId) {
  const res = await api.patch(`/users/${userId}/approve`);
  log("APPROVE USER", res.data);
  return res.data;
}

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════════════════════════════════

async function getAllProducts({
  page = 1,
  limit = 10,
  sort,
  category,
  brand,
  minPrice,
  maxPrice,
  rating,
  inStock,
  search,
} = {}) {
  const res = await api.get("/products", {
    params: { page, limit, sort, category, brand, minPrice, maxPrice, rating, inStock, search },
  });
  log("GET ALL PRODUCTS", res.data);
  return res.data;
}

async function getProductById(productId) {
  const res = await api.get(`/products/${productId}`);
  log("GET PRODUCT BY ID", res.data);
  return res.data;
}

async function deleteProduct(productId) {
  const res = await api.delete(`/products/${productId}`);
  log("DELETE PRODUCT", res.data);
  return res.data;
}

async function recoverProduct(productId) {
  const res = await api.patch(`/products/${productId}/recover`);
  log("RECOVER PRODUCT", res.data);
  return res.data;
}

// ═══════════════════════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════════════════════

async function getAllOrders({
  page = 1,
  limit = 10,
  sort,
  status,
  paymentStatus,
  shippingStatus,
  minTotal,
  maxTotal,
  startDate,
  endDate,
} = {}) {
  const res = await api.get("/orders", {
    params: { page, limit, sort, status, paymentStatus, shippingStatus, minTotal, maxTotal, startDate, endDate },
  });
  log("GET ALL ORDERS", res.data);
  return res.data;
}

async function getOrderById(orderId) {
  const res = await api.get(`/orders/${orderId}`);
  log("GET ORDER BY ID", res.data);
  return res.data;
}

// Valid: pending | confirmed | processing | shipped | delivered | cancelled | returned
async function updateOrderStatus(orderId, orderStatus) {
  const res = await api.patch(`/orders/${orderId}/status`, { orderStatus });
  log("UPDATE ORDER STATUS", res.data);
  return res.data;
}

// ═══════════════════════════════════════════════════════════════════════════
// BANNERS
// ═══════════════════════════════════════════════════════════════════════════

async function getAllBanners({ page = 1, limit = 10, sort, isActive } = {}) {
  const res = await api.get("/banners", { params: { page, limit, sort, isActive } });
  log("GET ALL BANNERS", res.data);
  return res.data;
}

async function getBannerById(bannerId) {
  const res = await api.get(`/banners/${bannerId}`);
  log("GET BANNER BY ID", res.data);
  return res.data;
}

async function createBanner(title, link, imageBuffer, filename) {
  const FormData = require("form-data");
  const form = new FormData();
  form.append("title", title);
  form.append("link", link);
  form.append("image", imageBuffer, filename);

  const res = await api.post("/banners", form, {
    headers: { ...form.getHeaders() },
  });
  log("CREATE BANNER", res.data);
  return res.data;
}

async function updateBanner(bannerId, { title, link, isActive, imageBuffer, filename } = {}) {
  const FormData = require("form-data");
  const form = new FormData();
  if (title) form.append("title", title);
  if (link) form.append("link", link);
  if (isActive !== undefined) form.append("isActive", String(isActive));
  if (imageBuffer) form.append("image", imageBuffer, filename);

  const res = await api.patch(`/banners/${bannerId}`, form, {
    headers: { ...form.getHeaders() },
  });
  log("UPDATE BANNER", res.data);
  return res.data;
}

async function deleteBanner(bannerId) {
  const res = await api.delete(`/banners/${bannerId}`);
  log("DELETE BANNER", res.data);
  return res.data;
}

async function recoverBanner(bannerId) {
  const res = await api.patch(`/banners/${bannerId}/recover`);
  log("RECOVER BANNER", res.data);
  return res.data;
}

// ═══════════════════════════════════════════════════════════════════════════
// RUN — edit this section to call whichever function you want to test
// ═══════════════════════════════════════════════════════════════════════════
const USER_ID= "69909a3e913df53ed55bf365"
const PRODUCT_ID = "69909a3f913df53ed55bf36b"

async function run() {
  try {
    // ── Uncomment the call you want to test ──

    await getAllUsers({ page: 1, limit: 5 });
    // await getUserById(USER_ID);
    // await restrictUser(USER_ID);
    // await approveUser(USER_ID);

    await getAllProducts({ page: 1, limit: 5, inStock: true });
    // await getProductById(PRODUCT_ID);
    // await deleteProduct(PRODUCT_ID);
    // await recoverProduct(PRODUCT_ID);

    // await getAllOrders({ status: "pending" });
    // await getOrderById("ORDER_ID");
    // await updateOrderStatus("ORDER_ID", "shipped");

    // await getAllBanners({ isActive: true });
    // await getBannerById("BANNER_ID");
    // await deleteBanner("BANNER_ID");
    // await recoverBanner("BANNER_ID");

    // Banner with image (requires fs):
    // const fs = require("fs");
    // const img = fs.readFileSync("./banner.jpg");
    // await createBanner("Summer Sale", "/category/sale", img, "banner.jpg");
    // await updateBanner("BANNER_ID", { title: "Winter Sale", isActive: false });

  } catch (err) {
    console.error("\n❌ Error:", err.response?.data || err.message);
  }
}

run();
