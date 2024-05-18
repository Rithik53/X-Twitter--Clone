import { prismaclient } from "../clients/db";

export interface CreateTweetPayload {
  content: string;
  imageURL?: string;
  userId: string;
}
class TweetService {
  public static createTweet(data: CreateTweetPayload) {
    return prismaclient.tweet.create({
      data: {
        content: data.content,
        imageURL: data.imageURL,
        author: { connect: { id: data.userId } },
      },
    });
  }

  public static getAllTweets() {
    return prismaclient.tweet.findMany({ orderBy: { createdAt: "desc" } });
  }
}
export default TweetService;
