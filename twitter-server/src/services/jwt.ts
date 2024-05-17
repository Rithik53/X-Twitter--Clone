import JWT from "jsonwebtoken"
import { prismaclient } from "../clients/db";
import { User } from "@prisma/client";
import { JWTUser } from "../interfaces";

const JWT_SECRET= "$ok@twitter";
// const JWT_SECRET= process.env.JWT_secret;
class JWTService{
    public static  generateTokenForUser(user: User){
        const payload: JWTUser={
            id: user?.id,
            email: user?.email

        }
        const token = JWT.sign(payload,JWT_SECRET);
        return token;
    }
    public static decodeToken(token: string){
        try {
            return JWT.verify(token, JWT_SECRET) as JWTUser;
        } catch (error) {
            return null
        }
    }
}
export default JWTService;