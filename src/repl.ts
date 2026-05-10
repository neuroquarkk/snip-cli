import { Utils } from '@utils';
import { AuthCmd, SnippetCmd } from '@commands';
import { State } from '@state';
import type { Completer } from 'readline/promises';
import { CONSTANTS } from '@constants';

function showHelp() {
    console.log(`
=== Snip CLI Help Menu ===

Authentication Commands:
  register    - Create a new account
  login       - Log in to your account
  logout      - Log out of the current session

Snippet Commands:
  touch       - Create a new snippet. Prompts for title, alias and content
  view        - View a snippet's content
                Usage: view [alias=<name>]
  ls          - List snippets with optional pagination and filtering
                Usage: ls [page=<num>] [limit=<num>] [search=<keyword>]
  edit        - Update an existing snippet
                Prompts interactively
  rm          - Delete a snippet
                Usage: rm [alias=<name>]

System Commands:
  help        - Show this help menu
  quit, exit  - Close the application
`);
}

const replCompleter: Completer = (line) => {
    const hits = CONSTANTS.COMMANDS.filter((c) =>
        c.startsWith(line.toLowerCase().trim())
    );

    return [hits.length ? hits : [], line];
};

export async function start() {
    await AuthCmd.verify();

    while (true) {
        const prompt = State.isAuthenticated() ? '[snip]>> ' : '>> ';
        const input = await Utils.getInput(prompt, replCompleter);

        const [cmd, ...args] = input.trim().split(/\s+/);
        if (!cmd) continue;

        switch (cmd.trim().toLowerCase()) {
            case 'register':
                await AuthCmd.register();
                break;

            case 'login':
                await AuthCmd.login();
                break;

            case 'logout':
                await AuthCmd.logout();
                break;

            case 'touch':
                await SnippetCmd.create();
                break;

            case 'view':
                await SnippetCmd.getByAlias(args);
                break;

            case 'ls':
                await SnippetCmd.getAll(args);
                break;

            case 'rm':
                await SnippetCmd.delete(args);
                break;

            case 'edit':
                await SnippetCmd.update();
                break;

            case 'help':
                showHelp();
                break;

            case 'quit':
            case 'exit':
                process.exit(0);

            default:
                console.log(`Unknown command: "${cmd}"`);
        }
    }
}
