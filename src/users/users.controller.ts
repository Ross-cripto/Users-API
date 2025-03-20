import { Controller, Get, Post, Body, Patch, Param, Res, UseGuards, Req, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';
import type { RequestWithUser } from './interfaces/request-payload.interface';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * UsersController handles user-related API endpoints such as authentication, 
 * user management, and profile retrieval.
 */
@ApiTags('users')
@Controller('users')
export class UsersController {
  /**
   * Injects the UsersService to handle business logic.
   * 
   * @param usersService - The service responsible for user operations.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Logs in a user.
   *
   * @param loginDto - User credentials (email & password).
   * @param res - Express response object to set authentication cookies.
   * @returns A success message and authentication cookies.
   */
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto }) // Specifies request body type in Swagger.
  @ApiResponse({ status: 200, description: 'Successful login!' })
  @ApiResponse({ status: 401, description: 'Incorrect username or password.' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.usersService.loginUser(loginDto, res);
  }

  /**
   * Logs out a user by clearing authentication cookies.
   *
   * @param res - Express response object to clear cookies.
   * @returns A success message.
   */
  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'Successful logout',
    headers: {
      'Set-Cookie': {
        description: 'Clears authentication cookies',
        schema: { type: 'string' }
      }
    }
  })
  async logout(@Res() res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.status(200).json({ message: 'Logout successful' });
  }

  /**
   * Registers a new user.
   * 
   * @param registerDto - New user data.
   * @param res - Express response object to set authentication cookies.
   * @returns A success message and registered user details.
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto }) // Defines request body type in Swagger.
  @ApiResponse({ status: 201, description: 'Successful register!' })
  @ApiResponse({ status: 409, description: 'The email is already registered' })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.usersService.registerUser(registerDto, res);
  }

  /**
   * Retrieves the authenticated user's profile.
   * 
   * @param req - The request object containing user data from the JWT.
   * @returns The user's profile (excluding password).
   */
  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get Authenticated User' })
  @ApiResponse({ status: 200, description: 'Returns authenticated user data' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getProfile(@Req() req: RequestWithUser) {
    return this.usersService.getProfile(req.user);
  }

  /**
   * Updates a user's information.
   * 
   * @param id - The ID of the user to update.
   * @param updateDto - The updated user data.
   * @param req - The request object containing the authenticated user.
   * @returns A success message and updated user data.
   */
  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update user information' })
  @ApiParam({ name: 'id', required: true, description: 'User ID to update' }) // Defines URL parameter in Swagger.
  @ApiBody({ type: UpdateUserDto }) 
  @ApiResponse({ status: 200, description: 'Updated user.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
    @Req() req: RequestWithUser
  ) {
    return this.usersService.updateUser(id, updateDto, req.user);
  }

  /**
   * Deletes a user by ID.
   * 
   * @param id - The ID of the user to delete.
   * @param req - The request object containing the authenticated user.
   * @returns A success message confirming deletion.
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', required: true, description: 'User ID to delete' })
  @ApiResponse({ status: 200, description: 'User deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deleteUser(
    @Param('id') id: string,
    @Req() req: RequestWithUser
  ) {
    return this.usersService.deleteUser(id, req.user);
  }

  /**
   * Retrieves a list of all users.
   * 
   * @param req - The request object containing the authenticated user.
   * @returns A list of all users in the database.
   */
  @Get('')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of users with their basic details'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllUsers(@Req() req: RequestWithUser) {
    return this.usersService.listAllUsers(req.user);
  }
}
