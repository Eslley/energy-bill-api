import type { Payload, TokenService, TokenType, TokenWrapper } from './service';

export class MockTokenService implements TokenService {
  private readonly tokenWrapper: TokenWrapper = {
    token: 'mock_key',
    expiresAt: Date.now(),
  };

  sign<Type extends TokenType>(
    _type: TokenType,
    _payload: Payload[Type]
  ): TokenWrapper {
    return this.tokenWrapper;
  }

  verify<Type extends TokenType>(token: TokenWrapper['token']): Payload[Type] {
    if (token !== this.tokenWrapper.token) {
      throw new Error('Invalid token');
    }

    return {
      sub: 'mock_user_id',
    } as Payload[Type];
  }
}
