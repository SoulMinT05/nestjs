import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseConfig } from 'src/config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Phone } from 'src/entities/phone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Phone])],
  providers: [UserService, DatabaseConfig],
  controllers: [UserController],
  exports: [UserModule],
})
export class UserModule {}
