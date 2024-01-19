interface Token {
    token: string;
    tokenExpiresAt: Date;
}

export interface Tokens {
    accessToken: Token;
    refreshToken: Token;
}
