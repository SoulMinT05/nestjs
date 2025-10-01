import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';

export class FindAllUsersDto {
  keyword?: string;
  page?: number;
}

export class CreateUserDto {
  name?: string;
  email: string;
  password: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/find-all')
  findAll() {
    return this.userService.findAll();
  }
  @Post('')
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }
  @Get('/:id')
  findUser(@Param('id') id: number) {
    return this.userService.findUser(id);
  }
  @Put('/:id')
  update(@Param('id') id: number, @Body() body: CreateUserDto) {
    return this.userService.updateUser(id, body);
  }
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
