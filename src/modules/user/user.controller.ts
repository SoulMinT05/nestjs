import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

export class FindAllUsersDto {
  keyword?: string;
  page?: number;
}

export class CreateUserDto {
  name: string;
  email: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('')
  findAllUsers(@Query() query: FindAllUsersDto) {
    return this.userService.findAllUsers(query);
  }
  @Post('')
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.userService.findUser(id);
  }
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
