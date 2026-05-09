export const CONSTANTS = {
    BASE_URL: process.env['BASE_URL'] || 'http://localhost:8080/api/v1',

    CRED_FILE: '.sniprc',

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
