import { Utils } from '@utils';
import { AuthCmd } from '@commands';
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

            case 'quit':
            case 'exit':
                process.exit(0);
        }
    }
}
