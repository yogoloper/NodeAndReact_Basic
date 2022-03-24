const express = require('express');
const app = express();
const port = 5000;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const config = require('./config/key');
const { User } = require('./models/User');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json
app.use(bodyParser.json());

const mongoose = require('mongoose');
const res = require('express/lib/response');
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDb Connected..'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World! a');
});

app.post('/register', (req, res) => {
  // 회원가입 할대 필요한 정보 client에서 가져오면
  // 그것들을 DB에 넣어준다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });

    return res.status(200).json({
      success: true,
    });
  });
});

app.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, userInfo) => {
    // 요청된 이메일 있는지 확인
    if (!userInfo) {
      return res.json({
        loginSuccess: false,
        message: '이메일이 존재 하지 않습니다.'
      });
    }
    // 이메일 존재하면 비밀번호 맞는지 확인
    userInfo.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다.'
        });
        
      // 비밀번호 맞다면 토큰 생성
      userInfo.generateToken((err, userInfo) => {
        if (err) return res.status(400).send(err);

        // 토큰을 쿠키에 저장
        res.cookie('x_auth', userInfo.token)
        .status(200)
        .json({ 
          loginSuccess: true,
          userId: userInfo._id
        })
      })
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
