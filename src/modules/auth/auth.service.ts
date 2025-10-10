import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { IPayload } from './dto/payload.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async register(userData: CreateAuthDto): Promise<User> {
    try {
      const existingUser = await this.authRepository.findOne({
        where: { email: userData.email },
      });
      if (existingUser) {
        throw new ConflictException('Email này đã được đăng ký');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = this.authRepository.create({
        ...userData,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        password: hashedPassword,
      });

      return this.authRepository.save(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Register error:', error.message);
      } else {
        console.error('Unknown error during register:', error);
      }
      throw error;
    }
  }

  async checkUserLogin(email: string, password: string) {
    const user = await this.authRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('Email này không tồn tại');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu không chính xác');
    }
    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('TIME_JWT_REFRESH_TOKEN'),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.authRepository.update(user.id, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      refreshToken: hashedRefreshToken,
    });

    return {
      ...user,
      accessToken,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      refreshToken: hashedRefreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Check and decode refreshToken into user info
      const payload: IPayload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_KEY'),
      });
      const user = await this.authRepository.findOneBy({ id: payload.sub });
      if (!user) {
        throw new NotFoundException('Người dùng không tồn tại');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      const newAccessToken = this.jwtService.sign(
        {
          sub: user.id,
          email: user.email,
        },
        { expiresIn: this.configService.get<string>('TIME_JWT_ACCESS_TOKEN') },
      );
      return {
        accessToken: newAccessToken,
      };
    } catch (err) {
      const error = err as Error;
      throw new UnauthorizedException(
        error.name === 'TokenExpiredError'
          ? 'Refresh token đã hết hạn'
          : `Lỗi xác thực: ${error.message}`,
      );
    }
  }
}

//   async login(userData: CreateAuthDto): Promise<User> {
//     const { email, password } = userData;
//     const user = await this.authRepository.findOne({
//       where: { email },
//     });
//     if (!user) {
//       throw new NotFoundException('Email này không tồn tại');
//     }

//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       throw new UnauthorizedException('Mật khẩu không chính xác');
//     }

//     return user;

//     // const payload = { sub: user.id, email: user.email };
//     // const accessToken = this.jwtService.sign(payload);

//     // return {
//     //   ...user,
//     //   // accessToken,
//     // };
//   }
// }
