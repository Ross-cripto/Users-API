import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/**
 * Authentication guard that checks for a valid JWT token in the request cookies.
 * If the token is valid, it attaches the payload to the request object.
 * If not, it throws an UnauthorizedException.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Constructor that injects the JwtService for verifying JWT tokens.
   *
   * @param jwtService - Service used for handling JWT operations.
   */
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Determines whether a request is allowed based on the validity of the JWT token.
   *
   * @param context - The execution context of the request.
   * @returns A boolean indicating if the request is authenticated.
   * @throws UnauthorizedException if no token is found or if the token is invalid/expired.
   */

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Access token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
