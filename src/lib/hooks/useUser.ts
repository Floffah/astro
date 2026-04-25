import { useQuery } from "convex/react";

import { api } from "@/convex/api";

export const useUser = () => useQuery(api.user.currentUser);
