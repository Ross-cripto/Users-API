import { HttpException, HttpStatus, Inject, Injectable, type OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, PrismaClient } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { setTokens } from 'src/common/utils/set-tokens';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import type { UpdateUserDto } from './dto/update-user.dto';
import { WSGateway } from 'src/websockets/websocket.gateway';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { LogNotifyHelper } from 'src/common/utils/log-notify.helper';

@Injectable()
export class UsersService {
  private readonly logHelper: LogNotifyHelper;

  /**
   * Constructor with dependency injection:
   * - logger: Winston logger for logging operations.
   * - jwtService: Service for generating and verifying JWT tokens.
   * - notificationGateway: Service for sending real-time notifications via Socket.IO.
   * - prisma: Service to interact with the MongoDB database via Prisma.
   */
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly jwtService: JwtService,
    private readonly notificationGateway: WSGateway,
    private readonly prisma: PrismaService,
  ) {
    this.logHelper = new LogNotifyHelper(this.logger, this.notificationGateway, 'UsersService');
  }

  /**
   * Retrieves all registered users from the database.
   * Logs the operation indicating who made the request and the number of users listed.
   *
   * @param req - The authenticated user's payload (from JWT)
   * @returns An array of users.
   */
  async listAllUsers(req: JwtPayload) {
    try {
      const users = await this.prisma.user.findMany();
      this.logHelper.logOperation(`El usuario ${req.email} ha realizado la operación de listar ${users.length} usuarios`);
      return users;
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Deletes a user by their ID.
   * Logs and sends a notification about the deletion operation.
   *
   * @param id - The ID of the user to delete.
   * @param req - The user payload of the request initiator.
   * @returns A confirmation message and the deleted user.
   */
  async deleteUser(id: string, req: JwtPayload) {
    try {
      this.logHelper.logOperation(`Usuario ${req.email} ha realizado la operación la eliminación del usuario con ID ${id}`);
      const user = await this.prisma.user.delete({
        where: { id },
      });

      if (!user) {
        throw new HttpException({ message: 'This user does not exist' }, HttpStatus.BAD_REQUEST);
      }
      return { message: 'User deleted!', user };
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Updates a user's information.
   * Logs the operation and excludes the password from the returned data.
   *
   * @param id - The ID of the user to update.
   * @param updateDto - The new data for the user.
   * @param req - The authenticated user's payload.
   * @returns A confirmation message and the updated user (without password).
   */
  async updateUser(id: string, updateDto: UpdateUserDto, req: JwtPayload) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateDto,
      });
      if (!user) {
        throw new HttpException({ message: 'This user does not exist' }, HttpStatus.BAD_REQUEST);
      }

      this.logHelper.logOperation(`Usuario ${req.email} ha realizado la operación de actualización del usuario con ID ${id}`);

      const { password, ...userWithoutPassword } = user;
      return { message: 'User updated!', user: userWithoutPassword };
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Retrieves the profile of the authenticated user.
   * Logs the action of viewing the profile.
   *
   * @param userPayload - The authenticated user's payload (from JWT).
   * @returns The user's data without the password.
   */
  async getProfile(userPayload: JwtPayload) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userPayload.id },
      });

      if (!user) {
        throw new HttpException({ message: 'This user does not exist' }, HttpStatus.BAD_REQUEST);
      }

      this.logger.info(`Usuario ${user.email} ha realizado la operación de ver su perfil`);
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Authenticates a user (login).
   * Validates credentials, generates and assigns tokens, and logs the login operation.
   *
   * @param authDto - Authentication data (email and password).
   * @param res - Express response object to set JWT cookies.
   * @returns A success message and the authenticated user's email.
   */
  async loginUser(authDto: LoginDto, res: Response) {
    try {
      const { email, password } = authDto;

      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new HttpException({ message: 'User or password invalid' }, HttpStatus.BAD_REQUEST);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException({ message: 'Incorrect password' }, HttpStatus.BAD_REQUEST);
      }

      // Generate and assign JWT tokens in cookies.
      setTokens(user, res, this.jwtService);

      this.logHelper.logOperation(`Usuario ${email} ha realizado la operación de login`);

      return { message: 'Successful login!', user: user.email };
    } catch (error) {
      throw new HttpException({ message: error.message }, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Registers a new user.
   * Hashes the password, creates the user, assigns tokens, and logs the registration.
   *
   * @param registerDto - Data for the new user.
   * @param res - Express response object to set JWT cookies.
   * @returns A success message and the registered user's details (without password).
   */
  async registerUser(registerDto: RegisterDto, res: Response): Promise<any> {
    const { email, password, first_name, last_name } = registerDto;
    // Hash the password before storing it for security.
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          first_name: first_name || null, 
          last_name: last_name || null,
        },
      });
      
      setTokens(newUser, res, this.jwtService);

      this.logHelper.logOperation(`Usuario ${email} ha realizado la operación de registro`);

      return {
        message: 'Successful register!',
        user: {
          id: newUser.id,
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
        },
      };
    } catch (error) {
      // Handle duplicate email error (Prisma error code P2002).
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException('The email is already registered', HttpStatus.CONFLICT);
        }
      }
      // Handle generic errors.
      const errorMessage = error instanceof HttpException
        ? error.getResponse()
        : 'Internal server error ' + error.message;
      const statusCode = error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(errorMessage, statusCode);
    }
  }
}
