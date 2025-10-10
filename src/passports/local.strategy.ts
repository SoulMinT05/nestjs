// LocalStrategy → dùng để xác thực người dùng khi họ đăng nhập (email + password).
// JwtStrategy → dùng để xác thực người dùng cho các request sau khi đã đăng nhập (qua token).

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const user = await this.authService.checkUserLogin(email, password);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userData } = user;
    return userData;
  }
}
