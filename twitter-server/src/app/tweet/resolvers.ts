import { Tweet } from "@prisma/client";
import { prismaclient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dotenv.config();

interface CreateTweetPayload {
  content: string;
  imageURL?: string;
}
const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const queries = {
  getAllTweets: () =>
    prismaclient.tweet.findMany({ orderBy: { createdAt: "desc" } }),
  getSignedURLForTweet: async (
    parent: any,
    { imageType, imageName }: { imageType: string; imageName: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");
    const allowedImageTypes = ["jpg", "jpeg", "png", "webp"];
    if (!allowedImageTypes.includes(imageType))
      throw new Error("Unsupported Image Type");

    const putObjectCommand = new PutObjectCommand({
      Bucket: "rithik-twitter-dev",
      Key: `uploads/${
        ctx.user.id
      }/tweets/${imageName}-${Date.now().toString()}.${imageType}`,
    });

    const signedURL = await getSignedUrl(s3Client, putObjectCommand);
    return signedURL;
  },
};
const mutations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: CreateTweetPayload },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) throw new Error("You are not authenticated");
    const tweet = await prismaclient.tweet.create({
      data: {
        content: payload.content,
        imageURL: payload.imageURL,
        author: { connect: { id: ctx.user.id } },
      },
    });

    return tweet;
  },
};

const extraResolvers = {
  Tweet: {
    author: (parent: Tweet) =>
      prismaclient.user.findUnique({ where: { id: parent.authorId } }),
  },
};

export const resolvers = { mutations, extraResolvers, queries };
