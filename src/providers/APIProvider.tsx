"use client";

import { DehydratedState } from "@tanstack/query-core";
import { FunctionComponent, PropsWithChildren } from "react";

import { api } from "@/lib/api";

export const APIProvider = api.withTRPC(
    ({ children }: PropsWithChildren) => children,
) as FunctionComponent<PropsWithChildren<{ state?: DehydratedState }>>;
