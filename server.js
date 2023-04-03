// Import required modules and objects from the './auth' file
const express = require('express');
const session = require('express-session');
const { passport, googleAuthOptions, logoutHandler, googleCallbackHandler, googleCallbackRedirect } = require('./public/auth');

// Create a new Express app
const app = express();

// Configure the Express session middleware
app.use(session({
  secret: 'etty01F^%WE1ing_00519_-03*4521&[&43]||@qHFOHI)@$&(HIOFE',
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport and configure Passport session middleware
app.use(passport.initialize());
app.use(passport.session());

function renderLoggedInView(req, res) {
  const userName = req.user.displayName || req.user.emails[0].value;
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Google Auth</title>
      </head>
      <body>
        <h1>Success Google Auth</h1>
        <div>
          <a href="/logout">Log out</a>
        </div>
        <div id="message"></div>
        <div id="welcome">
          <p id="userName">Welcome ${userName}</p>
        </div>
      </body>
    </html>
  `);
}

// render the login view
function renderLoginView(req, res) {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Google Login</title>
      </head>
      <body>
        <h1>Google Login</h1>
        <div>
          <a href="/auth/google">Log in with Google</a>
        </div>
      </body>
    </html>
  `);
}

function handleRootRoute(req, res) {
  if (req.isAuthenticated()) {
    renderLoggedInView(req, res);
  } else {
    renderLoginView(req, res);
  }
}

app.get('/', handleRootRoute);

app.get('/auth/google', passport.authenticate('google', googleAuthOptions));

app.get('/auth/google/callback', googleCallbackHandler, googleCallbackRedirect);

app.get('/logout', logoutHandler);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
