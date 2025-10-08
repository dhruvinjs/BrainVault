import mongoose, { Model, mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    username:{type:String,unique:true,required:true},
    password:{type:String,required:true}
})


export const User=mongoose.model("User",userSchema)

// const contentTypes=['twitter','image','video','article','youtube']
const contentSchema=new mongoose.Schema({
    title:{type:String,required:true},//Can be link, a document,
    type:{type:String,required:true},
    link:{type:String},//Can be link, a document
    tags:[String],
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
})

export const ContentModel=mongoose.model("Content",contentSchema)


//Brain Model
const brainSchema=new mongoose.Schema({
    share:{type:Boolean,default:false},
    content:[{type:mongoose.Types.ObjectId,ref:"Content"}],
    userId:{type:mongoose.Types.ObjectId,ref:"User"}
})

export const Brain=mongoose.model("Brain",brainSchema)


const linkSchema=new mongoose.Schema({
    hash:{type:String,required:true},
    userId:{type:mongoose.Schema.ObjectId,required:true},
})

export const Link=mongoose.model("Link",linkSchema)


const savedContentSchema=new mongoose.Schema({
    contentId:{type:mongoose.Schema.ObjectId,required:true,ref:"Content"},
    userId:{type:mongoose.Schema.ObjectId,required:true,ref:"User"}
})
savedContentSchema.index({ userId: 1, contentId: 1 }, { unique: true });
export const SavedPosts=mongoose.model("SavedPosts",savedContentSchema)