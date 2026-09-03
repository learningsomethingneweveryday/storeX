import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SAMPLE_PRODUCTS } from './src/data/sampleProducts';
import { Product, User, Order } from './src/types';

interface StoredUser extends User {
  passwordHash: string;
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'storex_jwt_production_secure_secret_token_key';

// Middleware
app.use(express.json());
app.use(cookieParser());

// In-memory Database Store
let productsDB: Product[] = JSON.parse(JSON.stringify(SAMPLE_PRODUCTS));

// Pre-seeded demo user
const demoPasswordHash = bcrypt.hashSync('password123', 10);
let usersDB: StoredUser[] = [
  {
    id: 'user-demo-1',
    name: 'Alex Johnson',
    email: 'demo@storex.com',
    passwordHash: demoPasswordHash,
    role: 'user',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Pre-seeded initial order for demo user
let ordersDB: Order[] = [
  {
    id: 'ORD-98421',
    userId: 'user-demo-1',
    customerName: 'Alex Johnson',
    customerEmail: 'demo@storex.com',
    shippingAddress: {
      fullName: 'Alex Johnson',
      addressLine1: '742 Evergreen Terrace',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'United States',
      phone: '+1 (555) 234-5678'
    },
    items: [
      {
        productId: 'prod-1',
        name: 'AeroPulse Wireless Noise-Cancelling Headphones',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        quantity: 1
      },
      {
        productId: 'prod-4',
        name: 'Quantum Ergonomic Wireless Precision Mouse',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
        quantity: 1
      }
    ],
    subtotal: 289.98,
    shippingFee: 0,
    discount: 20.00,
    totalAmount: 269.98,
    status: 'Delivered',
    paymentMethod: 'Credit Card',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Helper: Extract user from JWT token
const authenticateUser = (req: express.Request): StoredUser | null => {
  try {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const token = tokenFromHeader || req.cookies?.storex_token;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const user = usersDB.find(u => u.id === decoded.id);
    return user || null;
  } catch {
    return null;
  }
};

// ----------------------------------------------------
// REST API ROUTES
// ----------------------------------------------------

// 1. Health & Architecture Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      engine: 'In-Memory Indexed Store / Mongo-Compatible REST',
      productsCount: productsDB.length,
      usersCount: usersDB.length,
      ordersCount: ordersDB.length
    },
    version: '1.0.0-capstone'
  });
});

// 2. Categories
app.get('/api/products/categories', (req, res) => {
  const categoryCounts: Record<string, number> = {};
  productsDB.forEach(p => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  const categories = [
    { id: 'All', name: 'All Products', count: productsDB.length, icon: 'LayoutGrid' },
    ...Object.keys(categoryCounts).map(cat => ({
      id: cat,
      name: cat,
      count: categoryCounts[cat],
      icon: cat === 'Audio' ? 'Headphones' : cat === 'Computing' ? 'Laptop' : cat === 'Wearables' ? 'Watch' : cat === 'Smart Home' ? 'Home' : 'PlugZap'
    }))
  ];

  res.json({ success: true, data: categories });
});

// 3. Products: List with Search, Filter, Sort, Pagination
app.get('/api/products', (req, res) => {
  try {
    const {
      search = '',
      category = 'All',
      minPrice,
      maxPrice,
      rating,
      inStock,
      sort = 'newest',
      page = '1',
      limit = '20'
    } = req.query;

    let results = [...productsDB];

    // Search filter (name, category, description, brand)
    if (typeof search === 'string' && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (typeof category === 'string' && category !== 'All' && category !== '') {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Price range filter
    if (minPrice !== undefined && minPrice !== '') {
      const min = Number(minPrice);
      if (!isNaN(min)) results = results.filter(p => p.price >= min);
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      const max = Number(maxPrice);
      if (!isNaN(max)) results = results.filter(p => p.price <= max);
    }

    // Rating filter
    if (rating !== undefined && rating !== '') {
      const r = Number(rating);
      if (!isNaN(r)) results = results.filter(p => p.rating >= r);
    }

    // In Stock filter
    if (inStock === 'true') {
      results = results.filter(p => p.stock > 0);
    }

    // Sorting
    switch (sort) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    const total = results.length;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 20);
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = results.slice(startIndex, startIndex + limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: paginated
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Unable to load products. Please try again.' });
  }
});

// 4. Product: Single by ID + Related Products
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const product = productsDB.find(p => p.id === id);

  if (!product) {
    res.status(404).json({ success: false, error: 'Product not found.' });
    return;
  }

  const related = productsDB
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  res.json({
    success: true,
    data: {
      ...product,
      related
    }
  });
});

// 5. Create Product
app.post('/api/products', (req, res) => {
  const { name, description, price, category, image, stock = 10 } = req.body;

  if (!name || !description || price === undefined || !category || !image) {
    res.status(400).json({ success: false, error: 'Missing required product fields.' });
    return;
  }

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name,
    description,
    price: Number(price),
    category,
    image,
    rating: 5.0,
    reviewCount: 1,
    stock: Number(stock),
    createdAt: new Date().toISOString()
  };

  productsDB.unshift(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

// 6. Update Product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = productsDB.findIndex(p => p.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Product not found.' });
    return;
  }

  productsDB[index] = {
    ...productsDB[index],
    ...req.body,
    id // preserve id
  };

  res.json({ success: true, data: productsDB[index] });
});

// 7. Delete Product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = productsDB.findIndex(p => p.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Product not found.' });
    return;
  }

  const deleted = productsDB.splice(index, 1)[0];
  res.json({ success: true, message: 'Product deleted successfully', data: deleted });
});

// ----------------------------------------------------
// AUTHENTICATION ROUTES
// ----------------------------------------------------

// 8. Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, error: 'All fields are required.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ success: false, error: 'Passwords do not match.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
      return;
    }

    const existingUser = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      res.status(409).json({ success: false, error: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    usersDB.push(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('storex_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const { passwordHash: _, ...safeUser } = newUser;
    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      data: safeUser
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Server error during registration.' });
  }
});

// 9. Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required.' });
      return;
    }

    const user = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Invalid email or password.' });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('storex_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const { passwordHash: _, ...safeUser } = user;
    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      data: safeUser
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Server error during login.' });
  }
});

// 10. Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('storex_token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 11. Current User (me)
app.get('/api/auth/me', (req, res) => {
  const user = authenticateUser(req);
  if (!user) {
    res.status(401).json({ success: false, error: 'Unauthorized. Please log in.' });
    return;
  }

  const { passwordHash: _, ...safeUser } = user;
  res.json({ success: true, data: safeUser });
});

// ----------------------------------------------------
// ORDERS ROUTES
// ----------------------------------------------------

// 12. Get Orders (user specific or all simulated)
app.get('/api/orders', (req, res) => {
  const user = authenticateUser(req);
  
  if (user) {
    const userOrders = ordersDB.filter(o => o.userId === user.id || o.customerEmail.toLowerCase() === user.email.toLowerCase());
    res.json({ success: true, data: userOrders });
    return;
  }

  // If no auth token, return recent session orders or prompt
  res.json({ success: true, data: ordersDB.slice(0, 5) });
});

// 13. Create Order
app.post('/api/orders', (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod = 'Credit Card', discount = 0, shippingFee = 0 } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, error: 'Cannot place an empty order.' });
      return;
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.addressLine1 || !shippingAddress.city) {
      res.status(400).json({ success: false, error: 'Incomplete shipping address.' });
      return;
    }

    const user = authenticateUser(req);

    // Calculate subtotal and verify stock
    let subtotal = 0;
    const orderItems: Order['items'] = [];

    for (const item of items) {
      const prod = productsDB.find(p => p.id === item.productId || p.id === item.product?.id);
      if (!prod) {
        res.status(400).json({ success: false, error: `Product not found: ${item.name || item.productId}` });
        return;
      }

      const qty = item.quantity || 1;
      if (prod.stock < qty) {
        res.status(400).json({ success: false, error: `Insufficient stock for "${prod.name}". Available: ${prod.stock}` });
        return;
      }

      // Deduct stock in DB
      prod.stock -= qty;

      subtotal += prod.price * qty;
      orderItems.push({
        productId: prod.id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        quantity: qty
      });
    }

    const totalAmount = Math.max(0, subtotal + Number(shippingFee) - Number(discount));
    const randomOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: randomOrderId,
      userId: user?.id,
      customerName: shippingAddress.fullName,
      customerEmail: user?.email || req.body.customerEmail || 'guest@storex.com',
      shippingAddress,
      items: orderItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      shippingFee: parseFloat(Number(shippingFee).toFixed(2)),
      discount: parseFloat(Number(discount).toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      status: 'Confirmed',
      paymentMethod,
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    };

    ordersDB.unshift(newOrder);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: newOrder
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to process order.' });
  }
});

// 14. Get Order by ID
app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const order = ordersDB.find(o => o.id === id);

  if (!order) {
    res.status(404).json({ success: false, error: 'Order not found.' });
    return;
  }

  res.json({ success: true, data: order });
});

// ----------------------------------------------------
// VITE MIDDLEWARE & STATIC ASSETS
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StoreX full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
