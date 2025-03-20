import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { env } from 'src/config/envs';

/**
 * JWT Strategy for Passport. This strategy extracts the JWT from the request's cookies,
 * verifies it using the secret key, and provides the decoded payload to be used in the request.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * The constructor sets up the JWT extraction and validation configuration.
   */
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        return req?.cookies?.['access_token'] || null;
      },
      ignoreExpiration: false,
      secretOrKey: env.jwtSecret,
    });
  }

  /**
   * The validate method is automatically called by Passport after the JWT is verified.
   * It returns the user data extracted from the payload which will be attached to the request object.
   *
   * @param payload - The decoded JWT payload.
   * @returns An object containing the userId and email from the payload.
   */
  async validate(payload: any) {

    return { userId: payload.sub, email: payload.email };
  }
}
