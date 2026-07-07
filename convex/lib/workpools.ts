import { Workpool } from "@convex-dev/workpool";

import { components } from "@/convex/api";

export const genWorkpool = new Workpool(components.genWorkpool, {
    maxParallelism: 5,
});
