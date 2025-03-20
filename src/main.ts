import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './config/envs';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/http-custom-exception.filter';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    /** 
   * @method bootstrap
   * @description Bootstraps the application by creating an instance of the AppModule and setting up the global filters and pipes.
   * @returns {Promise<void>} A promise that resolves when the application is ready.
   */

    const app = await NestFactory.create(AppModule);
    
    const logger = new Logger;
    
    app.setGlobalPrefix('api');

    app.useGlobalFilters(new HttpExceptionFilter());

    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );

    const documentConfig = new DocumentBuilder()
      .setTitle("User's API")
      .setDescription("API to manage users")
      .setVersion("1.0")
      .build();

    const document = SwaggerModule.createDocument(app, documentConfig)
    SwaggerModule.setup('api', app, document)

    await app.listen(env.port)

    logger.log(`Server is running on port ${env.port}`);

}
bootstrap();
