var express = require('express');
var router = express.Router();
var createError = require('http-errors');

const { getAllUser, getUserId, createUser, updateUserById, deleteUserById } = require('@services/user');

router.get('/', async (req, res, next)=>{
    try {
        let data = await getAllUser()
        res.json(data)
    } catch (error) {
        return res.status(500).json('Khong the lay User')
    }
})

router.get('/:idUser', async (req, res, next)=>{
    try {
         let data = await getUserId(req.params.idUser)
         return res.json(data)
    } catch (error) {
         return res.status(500).json('Khong the lay user')
    }
 })

 // ADD USER CHO VUI THOI
// router.post('/', async (req, res, next)=>{
//     try {
//         console.log('req.body: ', req.body);
    
//         let newUser = {
//             ...req.body
//         }
//         let data = await createUser(newUser)
//         res.json(data)
//     } catch (error) {
//         return res.status(500).json("Khong the them san pham")
//     }
// })

router.put('/:idUser', async function(req, res, next){
    let idUser = req.params.idUser
    let name = req.body.name
    
    try {
      var data = await updateUserById(idUser, {name: name})
      res.json(data)
    } catch (error) {
      return next(createError(500, error.message))
    }
  })


//DELETE CHO VUI THÔI
router.delete('/:id', function(req, res, next){
    let id = req.params.id
    
    deleteUserById(id)
    .then(data => {
      res.json(data)
    })
    .catch(err => {
      res.json('xoa that bai')
    })
  })

module.exports = router