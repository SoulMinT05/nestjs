import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ICreateUserDto, IUpdateUserDto } from './user.controller';
import { Phone } from 'src/entities/phone.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,
  ) {}
  getAllUsers(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['phone', 'post'],
    });
  }
  getDetailUser(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['phone', 'post'],
    });
  }
  async createUser(userData: ICreateUserDto) {
    const { phone, password, ...userInfo } = userData;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepository.save({
      ...userInfo,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      password: hashedPassword,
    });

    if (phone) {
      const phoneEntity = await this.phoneRepository.save({ phone, user });
      await this.userRepository.save({
        ...user,
        phone: phoneEntity,
      });
    }

    return this.userRepository.findOne({
      where: { id: user.id },
      relations: ['phone', 'post'],
    });
  }

  async updateUser(id: number, userData: IUpdateUserDto) {
    const { phone, ...excludedPhone } = userData;
    await this.userRepository.update(id, excludedPhone);

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['phone', 'post'],
    });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    if (phone) {
      if (user.phone) {
        await this.phoneRepository.update(user.phone.id, { phone });
      } else {
        const phoneEntity = await this.phoneRepository.save({ phone, user });
        await this.userRepository.save({ ...user, phone: phoneEntity });
      }
    }

    return this.userRepository.findOne({
      where: { id },
      relations: ['phone', 'post'],
    });
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.delete(id);
    if (user.affected === 0) {
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
