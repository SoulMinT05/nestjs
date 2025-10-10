import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity';

export interface IRequestWithUser extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() userData: CreateAuthDto) {
    return this.authService.register(userData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req: IRequestWithUser) {
    return this.authService.login(req.user);
  }

  @Post('/refresh-token')
  refreshToken(@Body() { refreshToken }: { refreshToken: string }) {
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req: IRequestWithUser) {
    return this.authService.getProfile(req.user);
  }
}
