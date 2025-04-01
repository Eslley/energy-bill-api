export enum TokenType {
  AccessToken = 'AccessToken',
  IdToken = 'IdToken',
  RefreshToken = 'RefreshToken',
}

export type AccessTokenPayload = {
  sub: string;
};

export type IdTokenPayload = {
  sub: string;
  email: string;
  name: string;
};

export type RefreshTokenPayload = {
  sub: string;
};

export type Payload = {
  [TokenType.AccessToken]: AccessTokenPayload;
  [TokenType.IdToken]: IdTokenPayload;
  [TokenType.RefreshToken]: RefreshTokenPayload;
};

export type TokenWrapper = {
  token: string;
  expiresAt: number;
};

export interface TokenService {
  sign<Type extends TokenType>(
    type: TokenType,
    payload: Payload[Type]
  ): TokenWrapper;
  verify<Type extends TokenType>(token: TokenWrapper['token']): Payload[Type];
}
