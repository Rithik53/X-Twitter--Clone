import { Tweet } from "@prisma/client";
import { prismaclient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";

interface CreateTweetPayload {
  content: string;
  imageURL?: string;
}

const queries = {
  getAllTweets: () =>
    prismaclient.tweet.findMany({ orderBy: { createdAt: "desc" } }),
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
