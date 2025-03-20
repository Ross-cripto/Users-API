import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { WinstonModule } from 'nest-winston';
import { loggerOptions } from './common/utils/logger.config';



@Module({
  imports: [
    WinstonModule.forRoot(loggerOptions),
    UsersModule],
})
export class AppModule {}
