export const CONSTANTS = {
    BASE_URL: process.env['BASE_URL'] || 'http://localhost:8080/api/v1',

    CRED_FILE: '.sniprc',
} as const;
