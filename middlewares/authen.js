const { verifyToken } = require('@helper/jwt')
const createError = require('http-errors');

const checkAuth = (req, res, next)=>{
    try {
        let token = req.headers.authorization
        token = token?.split(' ')[1]

        // Check đăng xuất chưa, nếu rồi thì ko cho phép truy cập tài nguyên GET USER
        var isInvalidToken = global.blacklist.includes(token)
        if(isInvalidToken){
            return next(createError(403, 'Ban khong co quyen truy cap'))
        }

        // Check đã login chưa để lấy ra users
        if(token){
            let data = verifyToken(token)
            if(data){
                req.user = data
                next()
            }
        }else{
            return res.status(401).json('Ban chua dang nhap')
        }
    } catch (error) {
        return res.status(401).json('Token khong hop le')
    }
}

const checkAdmin = (req, res, next)=>{
    if(req.user.role === 'admin'){
        next()
    }else{
        return res.status(403).json('ban khong co quyen su dung api')
    }
}


// Middleware xác thực JWT để thực hiện chức năng Thay đổi mật khẩu
const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).send({ error: 'Vui lòng xác thực.' });
    }
    const token = authHeader.replace('Bearer ', '');
    // console.log('Received Token:', token);
    try {
        const decoded = verifyToken(token)
        req.user = decoded;
        // console.log('Decoded User:', req.user);
        next();
    } catch (error) {
        console.error('Authentication Error:', error);
        res.status(401).send({ error: 'Vui lòng xác thực.' });
    }
  };

module.exports = {
    checkAuth,
    checkAdmin,
    authMiddleware
}