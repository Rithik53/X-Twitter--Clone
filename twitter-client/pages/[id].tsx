import { graphqlClient } from "@/clients/api";
import FeedCard from "@/components/FeedCard";
import Twitterlayout from "@/components/FeedCard/Layout/TwitterLayout";
import { Tweet, User } from "@/gql/graphql";
import {
  followUserMutation,
  unfollowUserMutation,
} from "@/graphql/mutation/user";
import { getUserByIdQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { BsArrowLeftShort } from "react-icons/bs";

interface ServerProps {
  userInfo?: User;
}
const UserProfilePage: NextPage<ServerProps> = (props) => {
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();

  const amIfollowing = useMemo(() => {
    if (!props.userInfo) return false;
    return (
      (currentUser?.following?.findIndex(
        (el) => el?.id === props.userInfo?.id
      ) ?? -1) >= 0
    );
  }, [currentUser?.following, props.userInfo]);

  const handleFollowUser = useCallback(async () => {
    if (!props.userInfo?.id) return;

    try {
      await graphqlClient.request(followUserMutation, {
        to: props.userInfo.id,
      });
      await queryClient.invalidateQueries({ queryKey: ["current-user"] });
      toast.success("Followed user successfully", { id: "3" });
    } catch (error) {
      toast.error("Failed to follow user", { id: "3" });
      console.error("Follow user error:", error);
    }
  }, [props.userInfo?.id, queryClient]);

  const handleUnFollowUser = useCallback(async () => {
    if (!props.userInfo?.id) return;

    await graphqlClient.request(unfollowUserMutation, {
      to: props.userInfo?.id,
    });
    await queryClient.invalidateQueries({ queryKey: ["current-user"] });
  }, [props.userInfo?.id, queryClient]);
  return (
    <div>
      <Twitterlayout>
        <div>
          <nav className="flex items-center gap-3 py-3 px-3 ">
            <BsArrowLeftShort className="text-4xl" />
            <div>
              <h1 className="text-2xl font-bold">
                {props.userInfo?.firstName} {props.userInfo?.lastName}
              </h1>
              <h1 className="text-md font-bold text-slate-500">
                {props.userInfo?.tweets?.length} Tweets
              </h1>
            </div>
          </nav>
          <div className="p-4 border border-b border-slate-800">
            {props.userInfo?.profileImageURL && (
              <Image
                src={props.userInfo?.profileImageURL}
                alt="user-image"
                className="rounded-full"
                width={200}
                height={200}
              />
            )}
            <h1 className="text-2xl font-bold mt-5">
              {props.userInfo?.firstName} {props.userInfo?.lastName}{" "}
            </h1>
            <div className="flex justify-between items-center">
              <div className="flex gap-4 mt-2 text-sm text-gray-400">
                <span> {props.userInfo?.followers?.length} Followers</span>
                <span>{props.userInfo?.following?.length} Following</span>
              </div>
              {currentUser?.id !== props.userInfo?.id && (
                <>
                  {amIfollowing ? (
                    <button
                      onClick={handleUnFollowUser}
                      className="bg-white text-black px-3 py-1 rounded-full text-sm"
                    >
                      UnFollow
                    </button>
                  ) : (
                    <button
                      onClick={handleFollowUser}
                      className="bg-white text-black px-3 py-1 rounded-full text-sm"
                    >
                      Follow
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div>
            {props.userInfo?.tweets?.map((tweet) => (
              <FeedCard data={tweet as Tweet} key={tweet?.id} />
            ))}
          </div>
        </div>
      </Twitterlayout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  const id = context.query.id;

  if (!id) return { notFound: true, props: { userInfo: undefined } };

  const userInfo = await graphqlClient.request(getUserByIdQuery, {
    id: id as string,
  });
  if (!userInfo.getUserById) return { notFound: true };
  return { props: { userInfo: userInfo.getUserById as User } };
};
export default UserProfilePage;
