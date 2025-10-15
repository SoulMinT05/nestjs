import { Injectable } from '@nestjs/common';

@Injectable({})
export class DatabaseConfig {
  findAllUsers() {
    return 'all users';
  }
}
