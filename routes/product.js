var express = require('express');
const {createProduct, getProduct, getProductId, getTotalProduct, updateProduct, deleteProduct} = require('@services/product')
var router = express.Router();
const path = require('path')
const multer  = require('multer')
const fs = require('fs');
const { deleteImgByPaths } = require('../helper/upload');
const PATH_ROOT = path.join(__dirname, '..')
const PATH_UPLOAD = path.join(__dirname,'../uploads')
const PATH_AVATAR_UPLOAD = path.join(__dirname,'../uploads/product')
if(!fs.existsSync(PATH_UPLOAD)){
    fs.mkdirSync(PATH_UPLOAD)
}
if(!fs.existsSync(PATH_AVATAR_UPLOAD)){
    fs.mkdirSync(PATH_AVATAR_UPLOAD)
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, PATH_AVATAR_UPLOAD)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, `${uniqueSuffix}_${file.originalname}`)
    }
})

const upload = multer({
    storage: storage
})

const cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])

router.get('/', async (req, res, next)=>{
    try {
        let {page, pageSize, sort} = req.query
        // validate page, pageSize, sort

        let p1 = getProduct(page, pageSize, sort)
        let p2 = getTotalProduct()
        let data = await p1
        let total = await p2
        res.json({
            data: data,
            pagination: {
                page,
                total,
                pageSize 
            }
        })
    } catch (error) {
        return res.status(500).json('khong the lay SP')
    }
})

router.get('/:idProduct', async (req, res, next)=>{
   try {
        let data = await getProductId(req.params.idProduct)
        return res.json(data)
   } catch (error) {
        return res.status(500).json('Khong the lay san pham')
   }
})

router.post('/',cpUpload, async (req, res, next)=>{
    try {
        console.log('req.body: ', req.body);
        let {image, gallery} = req.files;
        image = image[0] ? `/uploads/product/${image[0].filename}` : "";
        gallery = gallery.map(item => {
            return `/uploads/product/${item.filename}`
        })

        let newProduct = {
            ...req.body,
            image,
            gallery
        }
        let data = await createProduct(newProduct)
        res.json(data)
    } catch (error) {
        return res.status(500).json("Khong the them san pham")
    }
})

router.put('/:id', cpUpload, async (req, res, next)=>{
    try {
        let productFined = await getProductId(req.params.id)
        if(!productFined){
            return res.status(500).json('khong tim thay san pham update')
        }

        let {name, price, stock, deleteGallery} = req.body
        let {image, gallery} = req.files
        console.log(image);
        if(image?.length > 0){
            image = `/uploads/product/${image[0].filename}`
        }else{
            image = null
        }
        if(gallery?.length > 0){
            gallery = gallery.map(item=>{
                return `/uploads/product/${item.filename}`
            })
        }

        let objUpdate = {}        
        if(name){ objUpdate.name = name }
        if(price){ objUpdate.price = price }
        if(stock){ objUpdate.stock = stock }
        if(image){ 
            objUpdate.image = image 
            // xoa anh cu~
            let url = path.join(PATH_ROOT, productFined.image)
            fs.unlink(url,()=>{})
        }
        if(deleteGallery){
            deleteGallery.forEach(element => {
                let url = path.join(PATH_ROOT, element)
                fs.unlink(url,()=>{})
            });
        }else{
            deleteGallery = []
        }
        let newGallery = productFined.gallery.filter(item=>{
            return !deleteGallery.includes(item)
        })
        newGallery = newGallery.concat(gallery)

        objUpdate.gallery = newGallery

        console.log(objUpdate);
        let data = await updateProduct(req.params.id, {
            $set: objUpdate,
        })
        return res.json(data)
    } catch (error) {
        console.log(error);
        return res.status(500).json('update khong thanh cong')
    }
})

router.delete('/:id', async (req, res, next)=>{
    try {
        let id = req.params.id;
        let product = await getProductId(id);
        if(!product){
            return res.status(400).json('khong the san pham');
        }
        let arr = [product.image, ...product.gallery]
        await deleteImgByPaths(arr)
        await deleteProduct(id)
        res.json('Xoa thanh cong')
    } catch (error) {
        console.log(error);
        return res.status(400).json('khong the san pham')
    }
})

module.exports = router;