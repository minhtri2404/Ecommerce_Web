const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/utils/connectDB');
const createAdminUser = require('./src/controllers/userController');


dotenv.config();

const startServer = async () => {
  try {
    await connectDB();          // chờ kết nối DB xong
    await createAdminUser();    // tạo admin nếu chưa có          

    const app = express();
    const port = process.env.PORT || 4000;

    app.use(cors());
    app.use(morgan('combined'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.set('views', path.join(__dirname, 'src/views'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(cookieParser());

    app.use(express.json());

    //Localhost:4000/api/auth
    const authRouter = require('./src/routes/authRoute');
    app.use('/api/auth', authRouter);

    //Localhost:4000/api/category
    const categoryRouter = require('./src/routes/categoryRoute');
    app.use('/api/categories', categoryRouter);

    //Localhost:4000/api/product
    const productRouter = require('./src/routes/productRoute');
    app.use('/api/products', productRouter);

    //Localhost:4000/api/cart
    const cartRouter = require('./src/routes/cartRoute');
    app.use('/api/cart', cartRouter);

    //Localhost:4000/api/order
    const orderRouter = require('./src/routes/orderRoute');
    app.use('/api/orders', orderRouter)
    
    app.get('/', (req, res) => {
      res.json({ message: 'Welcome' });
    });

    app.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`);
    });

  } catch (error) {
    console.error('❌ Lỗi khởi động server:', error);
  }
};

startServer();
