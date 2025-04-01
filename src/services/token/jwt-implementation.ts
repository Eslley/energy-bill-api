import config from 'config';
import { add } from 'date-fns';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { v4 as uuid } from 'uuid';

import { InvalidTokenError, TokenExpiredError } from './errors';
import type { Payload, TokenService, TokenType, TokenWrapper } from './service';

export class JwtTokenService implements TokenService {
  private readonly secret: string = config.get('auth.secret');
  private readonly options: Partial<jwt.SignOptions> = {
    algorithm: 'HS256',
    audience: 'base.api',
    issuer: 'https://base.api',
  };

  sign<Type extends TokenType>(
    type: TokenType,
    payload: Payload[Type]
  ): TokenWrapper {
    const expiresIn: Record<TokenType, string> = {
      AccessToken: config.get('auth.accessToken.expiresIn'),
      IdToken: config.get('auth.idToken.expiresIn'),
      RefreshToken: config.get('auth.refreshToken.expiresIn'),
    };

    const typ: Record<TokenType, string> = {
      AccessToken: 'at+jwt',
      IdToken: 'id+jwt',
      RefreshToken: 'rt+jwt',
    };

    const result = jwt.sign(payload, this.secret, {
      algorithm: this.options.algorithm,
      audience: this.options.audience,
      issuer: this.options.issuer,
      expiresIn: expiresIn[type],
      jwtid: uuid(),
      header: {
        alg: 'HS512',
        typ: typ[type],
      },
    });

    return {
      token: result,
      expiresAt: add(new Date(), { seconds: ms(expiresIn[type]) }).getTime(),
    };
  }

  verify<Type extends TokenType>(token: TokenWrapper['token']): Payload[Type] {
    try {
      const result = jwt.verify(token, this.secret, {
        audience: this.options.audience,
        issuer: this.options.issuer,
      });

      return result as Payload[Type];
    } catch (error) {
      const errors: Record<string, TokenExpiredError | InvalidTokenError> = {
        [jwt.TokenExpiredError.name]: new TokenExpiredError(),
        [jwt.JsonWebTokenError.name]: new InvalidTokenError(),
        [jwt.NotBeforeError.name]: new InvalidTokenError(),
      };

      throw errors[error.name] || error;
    }
  }
}
