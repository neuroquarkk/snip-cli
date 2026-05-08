import { Utils } from '@utils';
import { AuthCmd, SnippetCmd } from '@commands';
import { State } from '@state';

export async function start() {
    await AuthCmd.verify();

    while (true) {
        const prompt = State.isAuthenticated() ? '[snip]>> ' : '>> ';
        const cmd = await Utils.getInput(prompt);

        switch (cmd.toLowerCase()) {
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
                await SnippetCmd.getByAlias();
                break;

            case 'ls':
                await SnippetCmd.getAll();
                break;

            case 'rm':
                await SnippetCmd.delete();
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
