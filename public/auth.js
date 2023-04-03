const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();


// Google OAuth 2.0 인증에 필요한 설정
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'https://port-0-google-auth2-a4y62alg0nylxa.sel3.cloudtype.app/auth/google/callback';
const SCOPES = ['profile', 'email'];

// 구글 계정 인증 후 호출되는 콜백 함수
const googleStrategyCallback = (accessToken, refreshToken, profile, done) => {
  done(null, profile);
};

// Passport에 Google OAuth 2.0 전략 등록
passport.use(new GoogleStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: REDIRECT_URI
}, googleStrategyCallback));

// 세션에 사용자 정보 저장
passport.serializeUser((user, done) => {
  done(null, user);
});

// 세션에서 사용자 정보 복원
passport.deserializeUser((user, done) => {
  done(null, user);
});

// 여러 속성과 메소드를 포함한 객체 내보내기
module.exports = {
  passport,
  googleAuthOptions: {
    scope: SCOPES
  },
  // 로그아웃 처리 메소드
  // 세션을 파기하고 쿠키를 지워 사용자를 로그아웃시킵니다.
  logoutHandler: (req, res, next) => {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.clearCookie('connect.sid');
        res.redirect('/');
      }
    });
  },
  // googleCallbackHandler 메소드는 사용자가 Google 계정으로 인증한 후 처리되는 콜백입니다.
  googleCallbackHandler: passport.authenticate('google', {
    failureRedirect: '/'
  }),
  // googleCallbackRedirect 메소드는 인증 후 사용자를 리디렉션합니다.
  googleCallbackRedirect: (req, res) => {
    res.redirect('/');
  }
};
