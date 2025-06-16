import type { Request, Response, NextFunction } from "express";
import type { IUser } from "../models/user.model";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

if (!process.env.JWT_SECRET) {
    console.error(
        "FATAL ERROR: JWT_SECRET is not defined. Please set it in your environment variables."
    );
    process.exit(1);
}

export const signup = async (req: Request, res: Response): Promise<any> => {
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
                    id: newUser._id, // Include the actual user ID
                    fullName: newUser.fullname, // Corrected to 'fullName'
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

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ message: "No user exist with this email." });
        }

        const isPasswordValid = user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password." });
        }

        const token = jwt.sign(
            { name: user.fullname, email: user.email },
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
                    id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                },
                token,
            });
    } catch (error: any) {
        res.status(500).json({ message: "Error logging in" });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token").json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Error logging out" });
    }
};

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> => {
    let token;

    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res
            .status(401)
            .json({ message: "Not authorized, no token provided" });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res
                .status(404)
                .json({ message: "No user found with this ID" });
        }
        req.user = user;
        next(); // Pass control to the next middleware or route handler
    } catch (error: any) {
        console.error("Token verification error:", error);
        // Handle specific JWT errors like TokenExpiredError, JsonWebTokenError
        if (error.name === "TokenExpiredError") {
            return res
                .status(401)
                .json({ message: "Not authorized, token expired" });
        }
        if (error.name === "JsonWebTokenError") {
            return res
                .status(401)
                .json({ message: "Not authorized, invalid token" });
        }
        res.status(500).json({
            message: "Not authorized, token failed",
            error: error.message,
        });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        if (req.user) {
            res.status(200).json({
                success: true,
                data: {
                    id: req.user._id,
                    fullName: req.user.fullname,
                    email: req.user.email,
                    createdAt: req.user.createdAt,
                    updatedAt: req.user.updatedAt,
                },
            });
            return;
        }
    } catch (error) {
        res.status(401).json({
            message: "Not authorized, user data not available",
        });
    }
};
