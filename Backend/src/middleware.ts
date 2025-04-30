import jwt from "jsonwebtoken";
import { User } from "./db";
import express, { NextFunction, Request, Response } from "express";
export const authMiddleware=async (req:Request,res:Response,next:NextFunction) => {
    
    try {
        const token=req.cookies.token
        
        if(!token) res.status(404).json({message:"Token not found"})
        
        //@ts-ignore
        const decodedToken=jwt.verify(token as string,process.env.TOKEN_SECRET!) as {_id : string}
        if(!decodedToken) res.status(404).json({message:"Token Invalid"})
        const user=await User.findById(decodedToken._id)
        //@ts-ignore
        req.user=user
        next()

    } catch (error) {
        res.status(404).json({error:error})
        console.log(error);
    }

}