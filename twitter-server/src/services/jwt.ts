import JWT from "jsonwebtoken"
import { prismaclient } from "../clients/db";
import { User } from "@prisma/client";
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET= "$ok@twitter";
class JWTService{
    public static  generateTokenForUser(user: User){
        const payload={
            id: user?.id,
            email: user?.email

        }
        const token = JWT.sign(payload,JWT_SECRET);
        return token;
    }
}
export default JWTService;