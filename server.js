const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { s3, BUCKET } = require('./s3bucket/s3bucket');

require('dotenv').config();

const app = express();
const port = process.env.PORT;

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  // useCreateIndex: true
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connection established successfully!');
});

// connecting to s3 bucket
s3.listObjects({ Bucket: BUCKET }, (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected to S3 successfully!');
  }
});

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type',
  })
);
app.use(bodyParser.json());

// use routes
const usersRoute = require('./routes/users');
app.use('/users', usersRoute);

const storeRoute = require('./routes/stores');
app.use('/stores', storeRoute);

const shoppingCartRoute = require('./routes/shoppingCarts');
app.use('/shoppingCarts', shoppingCartRoute);

const managerRoute = require('./routes/managers');
app.use('/managers', managerRoute);

const itemRoute = require('./routes/items');
app.use('/items', itemRoute);

const deliverRoute = require('./routes/delivers');
app.use('/delivers', deliverRoute);

const deliveryRoute = require('./routes/deliveries');
app.use('/deliveries', deliveryRoute);

const categoryRoute = require('./routes/categories');
app.use('/categories', categoryRoute);

const basketRoute = require('./routes/baskets');
app.use('/baskets', basketRoute);

const invoiceRoute = require('./routes/invoices');
app.use('/invoices', invoiceRoute);

const graphBuilderRoute = require('./routes/buildGraph');
app.use('/build-graph', graphBuilderRoute);

const ordersRoute = require('./routes/orders');
app.use('/orders', ordersRoute);

const terminalsRoute = require('./routes/terminalNodes');
app.use('/terminals', terminalsRoute);

const deliveryItemRoute = require('./routes/deliveryItem');
app.use('/deliveryItem', deliveryItemRoute);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
