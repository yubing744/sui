import * as functions from "firebase-functions";
import {subscribeToSui} from "./sengridAPI";
/**
 *  API endpoint for Email Subscription using SendGrid API
 *  @param {string} email - email address to subscribe
 */

// eslint-disable-next-line max-len
export const emailSubscription = functions.https.onRequest(subscribeToSui);
