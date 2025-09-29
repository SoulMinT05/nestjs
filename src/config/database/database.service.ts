import { Injectable } from '@nestjs/common';

@Injectable({})
export class DatabaseService {
  findAllUsers() {
    return 'all users';
  }
}
