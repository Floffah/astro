/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as http from "../http.js";
import type * as lib_ai from "../lib/ai.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_weeklyReadingShared from "../lib/weeklyReadingShared.js";
import type * as lib_workpools from "../lib/workpools.js";
import type * as onboarding from "../onboarding.js";
import type * as user from "../user.js";
import type * as weeklyReadingGeneration from "../weeklyReadingGeneration.js";
import type * as weeklyReadings from "../weeklyReadings.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  http: typeof http;
  "lib/ai": typeof lib_ai;
  "lib/auth": typeof lib_auth;
  "lib/weeklyReadingShared": typeof lib_weeklyReadingShared;
  "lib/workpools": typeof lib_workpools;
  onboarding: typeof onboarding;
  user: typeof user;
  weeklyReadingGeneration: typeof weeklyReadingGeneration;
  weeklyReadings: typeof weeklyReadings;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  genWorkpool: import("@convex-dev/workpool/_generated/component.js").ComponentApi<"genWorkpool">;
};
