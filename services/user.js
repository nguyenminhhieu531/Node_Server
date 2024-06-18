const UserModel = require('@models/User')

function getUserByEmailAndPassword(email, password){
    return UserModel.findOne({ email: email, password: password }).lean()
}

function getUserByEmail(email){
    return UserModel.findOne({ email: email }).lean()
}

const createUser = async (createData) => {
    document = await UserModel.create(createData);
    return document;
};

 // ADD USER CHO VUI THOI
// function createUser(newUser){
//     return UserModel.create(newUser);
// }

const findOrCreate = async (query, createData) => {
    let document = await UserModel.findOne(query);
    if (!document) {
      document = await UserModel.create(createData);
    }
    return document;
};

const getAllUser = ()=>{
    return UserModel.find({}).select('-password')
}

function getUserId(id){
    return UserModel.findOne({
        _id: id
    }).select('-password')
}

function updateUserById(idUser, data){
    return UserModel.findByIdAndUpdate({
        _id: idUser
      },{
        $set: data
      }).select('-password')
}

function deleteUserById(id){
    return UserModel.deleteOne({_id: id})
}

function getIdChangePassword(id){
    return UserModel.findById({
        _id: id
    });
}


module.exports = {
    getUserByEmailAndPassword,
    getUserByEmail,
    findOrCreate,
    createUser,
    getAllUser,
    getUserId,
    deleteUserById,
    updateUserById,
    getIdChangePassword
}