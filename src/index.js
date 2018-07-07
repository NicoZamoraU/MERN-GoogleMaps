const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { mongoose } = require('./database');
const app = express();

// settings
app.set('port', process.env.PORT || 3000);
const routes = require('./routes/task.routes');

// middlewares
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use("/api/tasks", routes);

// Static files
// app.use(express.static());
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});