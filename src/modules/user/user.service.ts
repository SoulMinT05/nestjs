import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  findUser(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }
  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, userData);
    return this.userRepository.findOneBy({ id });
  }
  async deleteUser(id: string) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException({
        message: `Người dùng với ${id} không tồn tại`,
      });
    }
    return {
      success: true,
      message: `Đã xóa người dùng với ${id}`,
    };
  }
  async deleteAllUsers() {
    const users = await this.userRepository.deleteAll();
    if (users.affected === 0) {
      throw new NotFoundException({
        message: 'Không tồn tại người dùng để xóa',
      });
    }
    return {
      success: true,
      message: `Đã xóa ${users.affected} người dùng`,
    };
  }
}
