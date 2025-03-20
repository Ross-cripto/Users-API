/**
 * @interface JwtPayload
 * @description Interface to define the payload of the JWT token.
 * It contains the id, email, name and role of the user.
 */


export interface JwtPayload {
  id: string;
  email: string;
  first_name?: string | null; 
  last_name?: string | null;
}