import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

export default http;

// A bookmark is just a screenshot and the original text from twitter.
// Benefits:
// 1. Provides a better bookmarking tool than twitter
// Dashboard ->
// Views
// 1. - Index page: A calendar view which shows all the captures for each day, week or month
// 2. - An advanced AI search bar which shows all the resulting bookmarks which match a query
// How it works:
// 1. User submits their twitter tag and then on every webhook request we extract the @tags from the text
// and user that to find a user in the system. Associating that screenshot with their account.
// 2. When we recieve the webhook, we turn the original tweet
// (decide to use the .text or the screenshot as the embed source) in to an embedding.
// which will be useful when doing an AI context aware search.
//
// Commands:
// `
// @___emee_ bookmark this.
//
// tweet: <url of the actual tweet - due to tweeter restrictions>
// context: <the user provides additional context>
// `
