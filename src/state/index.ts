export class State {
    private static pat: string | null = null;

    public static setPat(pat: string): void {
        this.pat = pat;
    }

    public static getPat(): string | null {
        return this.pat;
    }

    public static clearPat(): void {
        this.pat = null;
    }

    public static isAuthenticated(): boolean {
        return this.pat !== null;
    }
}
