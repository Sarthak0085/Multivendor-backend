import { Request } from "express";
import { IUser } from "../models/user.model";


declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

declare global {
    namespace Express {
        interface Request {
            seller?: IShop
        }
    }
}