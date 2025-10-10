import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ValidationError } from 'class-validator';
// import { LoggerMiddleware } from './middlewares/logger/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(new LoggerMiddleware().use.bind(new LoggerMiddleware()));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        console.log('🔥 Validation errors:', validationErrors);
        return new BadRequestException(
          validationErrors.map((error) => ({
            // field: error.property,
            // error: error.constraints
            //   ? Object.values(error.constraints)[0]
            //   : 'Validation error',
            [error.property]: error.constraints
              ? Object.values(error.constraints)[0]
              : 'Validation error',
          })),
        );
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
