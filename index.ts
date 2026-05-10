import { handleArg } from 'src/cli';
import { start } from './src/repl';

async function main() {
    if (process.argv.length > 2) {
        handleArg(process.argv.slice(2));
    } else {
        start();
    }
}

main();
