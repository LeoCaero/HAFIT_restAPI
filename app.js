require('dotenv').config();
const express = require('express');
const connectToDatabase = require('./config/db');
const swaggerConfig = require('./config/swagger');
const usersRouter = require('./routes/user');
const productsRouter = require('./routes/product');
const plansRouter = require('./routes/plan');
const exercicesRouter = require('./routes/exercice');



const cors = require('cors');


const app = express();

app.use(cors());
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/images', express.static('images'));

// Swagger
swaggerConfig(app);

// Routes
app.use('/api/user', usersRouter);
app.use('/api/product', productsRouter);
app.use('/api/plan',plansRouter);
app.use('/api/exercice',exercicesRouter);

// Database Connection
connectToDatabase();

// Start Server
const port = process.env.PORT || 8002;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
  console.log(`Api documentation  at http://localhost:${port}/api-docs`);
});
