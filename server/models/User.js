const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    maxlength: 100,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
    
  },
  tokenExp: {
    type: Number,
  },
});

// user의 save() 함수 전에 실행
userSchema.pre('save', function (next) {
  // 현재 객체 정보를 저장
  var user = this;

  // 비밀번호가 수정될 때만 동작
  if (user.isModified('password')) {
    // 비밀번호를 암호화 시킨다.
    // 비밀번호를 암호화할 salf를 생성하고
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      // 입력 받은 비밀번호와 위에서 생성한 salt를 가지고 암호화
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next()
  }
});

userSchema.methods.comparePassword = function(plainPassword, cb) {
  // DB에 있는 비밀번호를 복호화 할수는 없으므로 인증라혀는 비밀번호를 암호화 한다.
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if (err) return cb(err)
      cb(null, isMatch)
  });
}

userSchema.methods.generateToken = function(cb) {
  var user = this;
  // jwt 이용해서 토큰 생성
  var token = jwt.sign(user._id.toHexString(), 'secretToken');
  user.token = token;
  user.save(function(err, uesrInfo) {
    if (err) return cb(err)
    cb(null, uesrInfo)
  })
}

userSchema.statics.findByToeken = function(token, cb) {
  var user = this;

  // 토큰을 복호화
  jwt.verify(token, 'secretToken', function(err, decoded) {
    // 유저 아이디를 통해 유저 검색후
    // 클라이언트에서 가져온 토큰과 DB에 보관된 토근이랑 일치하는지 확인

    user.findOne({'_id': decoded, 'token': token}, function (err, user) {
      if(err) return cb(err)
      cb(null, user)
    });
  });
}

const User = mongoose.model('User', userSchema);

module.exports = { User };
