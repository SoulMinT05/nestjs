import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';

export class FindAllUsersDto {
  keyword?: string;
  page?: number;
}

export interface ICreateUserDto {
  name?: string;
  email: string;
  phone?: string;
  password: string;
}

export interface IUpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
  @Get('/:id')
  async getDetailUser(@Param('id') id: number) {
    const user = await this.userService.getDetailUser(id);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return user;
  }
  @Post('')
  create(@Body() body: ICreateUserDto) {
    return this.userService.createUser(body);
  }
  @Put('/:id')
  update(@Param('id') id: number, @Body() body: ICreateUserDto) {
    return this.userService.updateUser(id, body);
  }
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }
  @Delete('')
  deleteAllUsers() {
    return this.userService.deleteAllUsers();
  }
}
