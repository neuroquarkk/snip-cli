import { join } from 'path';
import { homedir } from 'os';

export const CONSTANTS = {
    BASE_URL: process.env['BASE_URL'] || 'http://localhost:8080/api/v1',

    CRED_FILE: join(homedir(), '.sniprc'),

    COMMANDS: [
        'register',
        'login',
        'logout',
        'touch',
        'view',
        'ls',
        'edit',
        'rm',
    ],
} as const;
