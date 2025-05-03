import chalk from "chalk";
import inquirer from "inquirer";

import { getPostHogNodeClient } from "@/lib/analytics/nodeClient";

const answers = await inquirer.prompt([
    {
        type: "input",
        name: "distinctId",
        message: "Distinct ID to alias:",
    },
    {
        type: "input",
        name: "alias",
        message: "Alias to assign:",
    },
]);

const { distinctId, alias } = answers;

const posthog = getPostHogNodeClient();

posthog.alias({
    distinctId,
    alias,
});

console.log(`${chalk.green.bold("✓")} Alias created!`);
