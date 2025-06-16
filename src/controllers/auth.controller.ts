import type { Request, Response } from "express";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
    try {
        const { fullname, email, password } = req.body;

        const newUser = new User({ fullname, email, password });
        newUser.save();

        const token = jwt.sign(
            { name: newUser.fullname, email: newUser.email },
            process.env.JWT_SECRET!,
            { expiresIn: "1d" }
        );

        res.status(201)
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.IS_PROD === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000,
            })
            .json({
                message: "User created successfully",
                user: {
                    fullname: newUser.fullname,
                    email: newUser.email,
                },
                token,
            });
    } catch (error: any) {
        if (error.code === 11000) {
            return res
                .status(400)
                .json({ message: "Email already registered." });
        }
        res.status(500).json({
            message: "Error registering user",
            error: error.message,
        });
    }
};
