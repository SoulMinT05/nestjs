// LocalStrategy → dùng để xác thực người dùng khi họ đăng nhập (email + password).
// JwtStrategy → dùng để xác thực người dùng cho các request sau khi đã đăng nhập (qua token).

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IPayload } from 'src/modules/auth/dto/payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_TOKEN_KEY') ?? '',
    });
  }
  // Decode
  validate(payload: IPayload) {
    console.log(payload);
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
