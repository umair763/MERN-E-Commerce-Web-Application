require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/error');
const app = express();

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-e-commerce-web-application.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));

app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(cookieParser());

app.use(morgan('dev'));

app.use(
  '/api/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use('/api/health', require('./routes/health.route'));
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/admin', require('./routes/admin.auth.route'));
app.use('/api/super-admin', require('./routes/super-admin.auth.route'));
app.use('/api/products', require('./routes/product.route'));
app.use('/api/categories', require('./routes/category.route'));
app.use('/api/cart', require('./routes/cart.route'));
app.use('/api/orders', require('./routes/order.route'));
app.use('/api/payments', require('./routes/payment.route'));
app.use('/api/reviews', require('./routes/review.route'));
app.use('/api/addresses', require('./routes/address.route'));
app.use('/api/coupons', require('./routes/coupon.route'));
app.use('/api/wishlist', require('./routes/wishlist.route'));
app.use('/api/returns', require('./routes/return.route'));
app.use('/api/admin/analytics', require('./routes/analytics.route'));
app.use('/api/admin/permissions', require('./routes/permission.route'));
app.use('/api/admin/roles', require('./routes/role.route'));
app.use('/api/customer/dashboard', require('./routes/customer.dashboard.route'));
app.use('/api/admin/dashboard', require('./routes/admin.dashboard.route'));
app.use('/api/super-admin/dashboard', require('./routes/super.admin.dashboard.route'));
app.use('/api/users', require('./routes/user.route'));
app.use('/api/settings', require('./routes/settings.route'));
app.use('/api/audit-logs', require('./routes/audit.route'));

app.use(notFound);

app.use(errorHandler);
if (require.main === module) {
  connectDB()
    .then(() =>
      app.listen(process.env.PORT || 3000, () =>
        console.log(`StyleHive API listening on ${process.env.PORT || 3000}`),
      ),
    )
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
module.exports = app;
