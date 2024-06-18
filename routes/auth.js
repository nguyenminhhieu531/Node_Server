var express = require('express');
var router = express.Router();
var passport = require('passport');
const {genToken} = require('@helper/jwt')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { authMiddleware } = require('@middlewares/authen');
const { validateEmail, validatePassword } = require('@helper/validate');
const { getUserByEmail, createUser, getIdChangePassword, updateUserById } = require('@services/user');
var createError = require('http-errors');


// Dang ky
router.post('/signup', async function(req, res, next){
  try {
    let {email, name, password, avatar} = req.body
    // validate
    if(!validateEmail(email)){
      return res.status(400).json('Email khong hop le')
    }
    if(!validatePassword(password)){
      return res.status(400).json('Password khong hop le')
    }

    let userFinded = await getUserByEmail(email)
    if(userFinded){
      return res.status(400).json('Email da ton tai')
    }else{
      password = bcrypt.hashSync(password, saltRounds);
      let newUser = await createUser({email, name, password, avatar})
      newUser = newUser.toObject()
      delete newUser.password
      return res.json(newUser)
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json('Tao tai khoan that bai')
  }
})

// Dang nhap
router.post('/login', function(req, res, next){
  passport.authenticate('local', function(err, user, info) {
    try {
      if (err) { return res.status(400).json('dang nhap khong thanh cong') }
      if (!user) { return res.status(400).json('Tai khoan va mat khau khong dung') }
      
      
      let token = genToken(user)
            
      return res.json({
        token,
        user
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json('Loi server')
    }
  })(req, res, next)
});

router.get('/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ]
}));
router.get('/google/callback', function(req, res, next){
  passport.authenticate('google', function(err, user, info) {
    try {
      if (err) { 
        return res.status(400).json('dang nhap khong thanh cong') 
      }
      if (!user) { return res.status(400).json('Tai khoan khong ton tai') }
      
      let token = genToken(user)
           
      return res.json({
        token,
        user
      })
    } catch (error) {
      return res.status(500).json('Loi server')
    }
  })(req, res, next)
});


// Dang xuat
router.get('/logout', (req, res, next) => {
  let token = req.headers.authorization.split(' ')[1];
  global.blacklist.push(token);
  res.json("Dang xuat thanh cong")
})

// Thay doi mat khau
router.post('/change-password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).send({ error: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }
  try {
    // const user = await UserModel.findById(req.user._id);
    const user = await getIdChangePassword(req.user._id);
    console.log(user);
    if (!user) {
      return res.status(404).send({ error: 'Người dùng không tồn tại.' });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Mật khẩu cũ không chính xác.' });
    }
    user.password = await bcrypt.hash(newPassword, 8);
    await user.save();

    res.send({ message: 'Mật khẩu đã được thay đổi thành công.' });
  } catch (error) {
    res.status(500).send({ error: 'Đã xảy ra lỗi.' });
  }
});

// Update profile
router.put('/update-profile/:idUser', async function(req, res, next){
  let idUser = req.params.idUser
  let name = req.body.name
  
  try {
    var data = await updateUserById(idUser, {name: name})
    res.json(data)
  } catch (error) {
    return next(createError(500, error.message))
  }
})

// Quên mật khẩu
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send('Không tìm thấy người dùng với địa chỉ email này.');
    }

      // Gửi email chứa link đặt lại mật khẩu
      // Code này phụ thuộc vào dịch vụ email bạn sử dụng (ví dụ: Nodemailer)
      // Ở đây, tôi sẽ giả sử rằng bạn gửi email qua một API khác

      return res.json({ message: 'Password reset link sent successfully' });
  } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
