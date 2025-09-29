import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DatabaseService } from 'src/config/database/database.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly databaseService: DatabaseService,
  ) {
    console.log('Khoi tao Auth Controller');
  }

  @Post('/register')
  register() {
    return this.authService.register();
  }

  @Post('/login')
  login() {
    return this.authService.login();
  }
}
