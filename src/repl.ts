import { Utils } from '@utils';

export async function start() {
    while (true) {
        const cmd = await Utils.getInput('>> ');

        console.log(cmd);
        switch (cmd.toLowerCase()) {
            case 'quit':
            case 'exit':
                process.exit(0);
        }
    }
}
