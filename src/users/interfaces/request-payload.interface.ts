import type { JwtPayload } from "./jwt-payload.interface";

/**
 * @interface RequestWithUser
 * @description Interface to extend the JwtPayload to add the user value in the request.
 */

export interface RequestWithUser extends Request {
  user: JwtPayload;
}