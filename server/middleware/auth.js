const { User } = require('../models/User');

// 인증 처리 하는 곳
let auth = (req, res, next) => {
  // 클라이언트 쿠키에서 토큰 추출
  let token = req.cookies.x_auth;

  // 토큰 복호화 후 유저 검색
  User.findByToeken(token, (err, user) => {

    if (err) throw err;
    // 유저 없으면 인증 No
    if (!user) return res.json({ isAuth: false, error: true });

    // 유저 있으면 인증 Okay
    req.token = token;
    req.user = user;
    next();
  });
};
module.exports = { auth };
