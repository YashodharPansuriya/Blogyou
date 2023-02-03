const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db.js');

// Load config
dotenv.config({ path: './config/config.env' })

// Passport configuration
require('./config/passport')(passport)  

const app = express();

//connect db
connectDB()

//Logging configuration
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars configuration
app.engine('.hbs', exphbs({ defaultLayout: 'main' ,extname : '.hbs' }));
app.set('view engine', '.hbs');

//Sessions configuration
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
})
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));