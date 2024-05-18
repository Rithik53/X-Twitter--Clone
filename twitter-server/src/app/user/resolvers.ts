import axios from "axios";
import { prismaclient } from "../../clients/db";
import JWTService from "../../services/jwt";
import { GraphqlContext } from "../../interfaces";
import { User } from "@prisma/client";

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
const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
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
  },
  getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
    //console.log(ctx);
    const id = ctx.user?.id;
    if (!id) return null;

    const user = await prismaclient.user.findUnique({ where: { id } });
    return user;
  },
  getUserById: async (
    parent: any,
    { id }: { id: string },
    ctx: GraphqlContext
  ) => prismaclient.user.findUnique({ where: { id } }),
};

const extraResolvers = {
  User: {
    tweets: (parent: User) =>
      prismaclient.tweet.findMany({ where: { author: { id: parent.id } } }),
  },
};

export const resolvers = { queries, extraResolvers };
