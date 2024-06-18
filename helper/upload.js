const { error } = require('console');
const fs = require('fs')
const path = require('path')

async function deleteImgByPaths(arr){
    var listPromise = []
    arr.forEach(imgPath => {
        let url = path.join(__dirname, `../${imgPath}`)

        let pro = new Promise((resolve, reject)=>{
            if(fs.existsSync(url)){
                fs.unlink(url, (err)=>{
                    if(err){
                        console.log(error);
                        return reject('Khong the xoa anh')
                    }else{
                        resolve() 
                    }
                })
            }else{
                return resolve('Khong co file để xóa`')
            }
        })
        listPromise.push(pro)
    });

    return Promise.all(listPromise)
}


module.exports = {
    deleteImgByPaths
}