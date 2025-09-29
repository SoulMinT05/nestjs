import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseService } from 'src/config/database/database.service';

@Module({
  providers: [UserService, DatabaseService],
  controllers: [UserController],
  exports: [UserModule],
})
export class UserModule {}
