import axios from "axios";
import { prismaclient } from "../clients/db";
import JWTService from "./jwt";

interface GoogleTokenResult {
  iss?: string;
  azp?: string;
  aud?: string;
  sub?: string;
  email?: string;
  email_verified?: string;
  nbf?: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
  iat?: string;
  exp?: string;
  jti?: string;
  alg?: string;
  kid?: string;
  typ?: string;
}

class UserService {
  public static async verifyGoogleAuthToken(token: string) {
    try {
      const googleToken = token;
      const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
      googleOauthURL.searchParams.set("id_token", googleToken);

      const { data } = await axios.get<GoogleTokenResult>(
        googleOauthURL.toString(),
        {
          responseType: "json",
        }
      );
      const user = await prismaclient.user.findUnique({
        where: { email: data.email },
      });
      if (!user && data.email && data.given_name) {
        await prismaclient.user.create({
          data: {
            email: data.email,
            firstName: data.given_name,
            lastName: data.family_name,
            profileImageURL: data.picture,
          },
        });
      }
      const userInDb = await prismaclient.user.findUnique({
        where: { email: data.email },
      });
      if (!userInDb) throw new Error("user with email not found");
      const userToken = await JWTService.generateTokenForUser(userInDb);
      //console.log(data);
      // console.log(JSON.stringify(data));
      return userToken;
    } catch (error) {
      console.error(error);
      throw new Error("Token verification failed"); // Return an error message or handle as needed
    }
  }

  public static getUserById(id: string) {
    return prismaclient.user.findUnique({ where: { id } });
  }
  public static followUser(from: string, to: string) {
    return prismaclient.follows.create({
      data: {
        follower: { connect: { id: from } },
        following: { connect: { id: to } },
      },
    });
  }

  public static unfollowUser(from: string, to: string) {
    return prismaclient.follows.delete({
      where: { followerId_followingId: { followerId: from, followingId: to } },
    });
  }
}

export default UserService;
