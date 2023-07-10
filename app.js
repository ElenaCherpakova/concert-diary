// Load environment variables from .env file
require('dotenv').config();

// Import dependencies
const express = require('express');
require('express-async-errors');
const app = express();
const path = require('path');
// const ejsLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const rateLimiter = require('express-rate-limit'); //SECURITY
const helmet = require('helmet'); //SECURITY
// const xss = require('xss');

const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');

// Import local modules
const connectDB = require('./db/connect');
const passport_init = require('./passport/passport_init');
const pageRouter = require('./routes/page_routes');
const aboutRouter = require('./routes/about_routes');

const concertRouter = require('./routes/concert_routes');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');

const {
  authMiddleware,
  setCurrentUser,
  csrf,
  xssClean,
} = require('./middleware/auth');

// Set the port
const port = process.env.PORT || 3000;

// Template engine

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up the MongoDB session store
const url = process.env.MONGO_URI;
const store = new MongoDBStore({
  uri: url,
  collection: 'mySessions',
});
store.on('error', (error) => console.log(error));

// Configure session parameters
const session_params = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: {
    secure: false,
    sameSite: 'strict',
  },
};

// Configure secure session settings for production environment
if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  session_params.cookie.secure = true;
}

// Set Middleware and app settings

app.use(session(session_params));
passport_init();
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const scriptSrcUrls = [
  'https://stackpath.bootstrapcdn.com/',
  'https://cdn.jsdelivr.net/',
];

const styleSrcUrls = [
  'https://stackpath.bootstrapcdn.com/',
  'https://cdn.jsdelivr.net/',
  'https://fonts.googleapis.com/',
  'https://fonts.gstatic.com',
  'https://use.fontawesome.com/',
  'https://kit-free.fontawesome.com/',
];

// Apply security middleware
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'blob:', 'data:'],
        scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
        objectSrc: ["'none'"],
        fontSrc: ["'self'", ...styleSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        childSrc: ['blob:'],
        upgradeInsecureRequests: null,
      },
    },
  })
);
app.use(xssClean);
app.use(csrf);
app.use(setCurrentUser);
// Routes
app.use('/', pageRouter);
app.use('/about', aboutRouter);
app.use('/concerts', authMiddleware, concertRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(url);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
