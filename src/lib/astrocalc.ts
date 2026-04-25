import createClient from "openapi-fetch";

import { paths } from "@/types/apis/astrocalc";

const astrocalcBaseUrl =
    process.env.ASTROCALC_BASE_URL ?? "https://astrocalc-api.onrender.com";

export const astrocalc = createClient<paths>({
    baseUrl: astrocalcBaseUrl,
});
