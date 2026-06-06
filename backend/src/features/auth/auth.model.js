import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    user_id:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      unique:true
    },
    name:{
        type:String,
        required: true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const User = mongoose.model('User', UserSchema);

export default User;