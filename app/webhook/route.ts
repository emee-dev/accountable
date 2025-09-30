import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

interface Tweet {
  type: "tweet";
  id: string;
  url: string;
  twitterUrl: string;
  text: string;
  source: string;
  retweetCount: number;
  replyCount: number;
  likeCount: number;
  quoteCount: number;
  viewCount: number;
  createdAt: string;
  lang: string;
  bookmarkCount: number;
  isReply: boolean;
  inReplyToId: string | null;
  conversationId: string;
  displayTextRange: number[];
  inReplyToUserId: string | null;
  inReplyToUsername: string | null;
  author: {
    type: "user";
    userName: string;
    url: string;
    twitterUrl: string;
    id: string;
    name: string;
    isVerified: boolean;
    isBlueVerified: boolean;
    verifiedType: string | null;
    profilePicture: string;
    coverPicture: string;
    description: string;
    location: string;
    followers: number;
    following: number;
    status: string;
    canDm: boolean;
    canMediaTag: boolean;
    createdAt: string;
    entities: {
      description: { urls: any[] };
      url: Record<string, any>;
    };
    fastFollowersCount: number;
    favouritesCount: number;
    hasCustomTimelines: boolean;
    isTranslator: boolean;
    mediaCount: number;
    statusesCount: number;
    withheldInCountries: string[];
    affiliatesHighlightedLabel: Record<string, any>;
    possiblySensitive: boolean;
    pinnedTweetIds: string[];
    profile_bio: {
      description: string;
      entities: {
        description: {
          hashtags?: { indices: number[]; text: string }[];
        };
      };
    };
    isAutomated: boolean;
    automatedBy: string | null;
  };
  extendedEntities: Record<string, any>;
  card: any;
  place: Record<string, any>;
  entities: {
    user_mentions: {
      id_str: string;
      indices: number[];
      name: string;
      screen_name: string;
    }[];
  };
  quoted_tweet: any;
  retweeted_tweet: any;
  isLimitedReply: boolean;
  article: any;
}

interface TwitterAPI {
  tweets: Tweet[];
  rule_id: string;
  rule_tag: string;
  rule_value: string;
  event_type: "tweet";
  timestamp: number;
}

type TweetMessage = {
  thread_screenshot: string;
  thread_md_summary: string;
  tweet: {
    id: string;
    url: string;
    twitterUrl: string;
    text: string;
    createdAt: string;
  };
  tweetBy: {
    id: string;
    userName: string;
    profilePicture: string;
    profile_bio: string;
  };
  replyingTo: {
    id: string;
    userName: string;
    replyId: string;
  };

  twitterUrl: string;
  xCancelTweetUrl: string;
};

const getScreenShotUrls = (props: Tweet) => {
  const replyingToId = props.inReplyToId;
  const userInSystem = props.author.userName;
  const replyingToUser = props.inReplyToUsername;

  const twitterUrl = `https://x.com/${replyingToUser}/status/${replyingToId}`;
  const xCancelTweetUrl = `https://xcancel.com/${replyingToUser}/status/${replyingToId}`;

  return { twitterUrl, xCancelTweetUrl };
};

const apiSecret = process.env.TWITTER_API_IO_SECRET;

// Recieves webhook events from twitterapi.io
export const POST = async (req: NextRequest) => {
  try {
    const reqHeaders = await headers();
    const receivedAPIKey = reqHeaders.get("x-api-key");

    if (receivedAPIKey !== apiSecret) {
      return Response.json({ message: "Forbidden" }, { status: 404 });
    }

    const body = (await req.json()) as TwitterAPI;

    // Format messages
    const tweetMessages: TweetMessage[] = body.tweets.map((item) => ({
      thread_screenshot: "",
      thread_md_summary: "",

      // Original twitter metadata
      tweet: {
        id: item.id,
        url: item.url,
        twitterUrl: item.twitterUrl,
        text: item.text,
        createdAt: item.createdAt,
      },

      tweetBy: {
        id: item.author.id,
        userName: item.author.userName,
        profilePicture: item.author.profilePicture || "",
        profile_bio: item.author.profile_bio.description || "",
      },

      replyingTo: {
        id: item.inReplyToUserId as string,
        userName: item.inReplyToUsername as string,
        replyId: item.inReplyToId as string,
      },

      ...getScreenShotUrls(item),
    }));

    // Remove untagged tweets
    const taggedTweets = tweetMessages.filter(
      (item) =>
        item.tweet.text.toLowerCase().includes("@usepanda_ bookmark this") ||
        item.tweet.text.toLowerCase().includes("usepanda_ bookmark this")
    );

    await fetchMutation(api.bookmarks.handleWebhook, { tweets: taggedTweets });

    return Response.json({ message: "ok" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
