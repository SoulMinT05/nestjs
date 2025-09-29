import { Injectable, Scope } from '@nestjs/common';
import { DatabaseService } from 'src/config/database/database.service';
import { CreateUserDto, FindAllUsersDto } from './user.controller';

@Injectable({ scope: Scope.TRANSIENT })
export class UserService {
  constructor(private readonly db: DatabaseService) {
    console.log('Khoi tao User Service');
  }
  findAllUsers(query: FindAllUsersDto) {
    return query;
  }
  create(body: CreateUserDto) {
    return {
      name: body.name,
      email: body.email,
    };
  }
  findUser(id: string) {
    return `Get user with id: ${id}`;
  }
  deleteUser(id: string) {
    return `Deleted user with id: ${id}`;
  }
}
