import { Utils } from '@utils';
import { AuthCmd, SnippetCmd } from '@commands';
import { State } from '@state';

export async function start() {
    await AuthCmd.verify();

    while (true) {
        const prompt = State.isAuthenticated() ? '[snip]>> ' : '>> ';
        const input = await Utils.getInput(prompt);

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

            case 'quit':
            case 'exit':
                process.exit(0);
        }
    }
}
