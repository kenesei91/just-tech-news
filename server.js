const path = require('path');
const express = require('express');
// session used to store reques such as user log in
const session = require('express-session');
const routes = require('./controllers/');
// handlebar
const exphbs = require('express-handlebars');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

// handlebar
const hbs = exphbs.create({});

// handlebar
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// added to connect path to style.css
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers/'));

// turn on routes
app.use(routes);

// turn on connection to db and server
// force: true performs similarly to DROP TABLE IF EXISTS in SQL
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
