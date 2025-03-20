import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { WebSocketsModule } from 'src/websockets/websockets.module';
import { PrismaModule } from 'src/config/prisma/prisma.module';

/**
 * UsersModule is responsible for user-related operations such as authentication,
 * registration, and profile management. It imports necessary modules and registers the
 * UsersService and UsersController for handling user requests.
 * It also configures JWT for authentication purposes.
 */
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
      JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '15m' },
      }),
      WebSocketsModule,
      PrismaModule,
    ]
})
export class UsersModule {}
