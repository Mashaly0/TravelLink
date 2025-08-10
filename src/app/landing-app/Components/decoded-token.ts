export interface DecodedToken {
    sub: string;
    jti: string;
    email: string;
    roles: string;
    aud: string;
    exp: number;
    iss: string;
    [key: string]: any;
}
