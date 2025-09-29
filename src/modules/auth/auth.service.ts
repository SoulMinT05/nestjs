import { Injectable, Scope } from '@nestjs/common';
import { DatabaseService } from 'src/config/database/database.service';

@Injectable({ scope: Scope.TRANSIENT })
export class AuthService {
  constructor(private readonly db: DatabaseService) {
    console.log('Khoi tao auth service');
  }
  register() {
    return this.db.findAllUsers();
  }
  login() {
    return {
      message: 'Login account service',
    };
  }
}
