import { Injectable, NotFoundException } from '@nestjs/common';
import { IBodyCourse } from './course.controller';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { Course } from './entities/course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  findAll() {
    return this.courseRepository.find({
      relations: ['users'],
    });
  }

  findOne(id: number) {
    return this.courseRepository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  async create(courseData: IBodyCourse) {
    const { userIds, ...excludedUserIds } = courseData;

    let users: User[] = [];
    if (userIds && userIds.length > 0) {
      users = await this.userRepository.findBy({ id: In(userIds) });
      if (users.length !== userIds.length) {
        throw new NotFoundException('Một số users không tồn tại');
      }
    }

    const newCourse = this.courseRepository.create({
      users,
      ...excludedUserIds,
    });

    const savedCourse = await this.courseRepository.save(newCourse);
    return this.courseRepository.findOne({
      where: { id: savedCourse.id },
      relations: ['users'],
    });
  }

  async update(id: number, courseData: IBodyCourse) {
    const { userIds, ...excludedUserIds } = courseData;

    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!course) {
      throw new NotFoundException(`Không tìm thấy khóa học với id ${id}`);
    }

    let users: User[] = [];
    if (userIds && userIds.length > 0) {
      users = await this.userRepository.findBy({ id: In(userIds) });
      if (users.length !== userIds.length) {
        throw new NotFoundException('Một số người dùng không tồn tại');
      }
    }

    Object.assign(course, excludedUserIds);
    course.users = users;

    await this.courseRepository.save(course);

    return this.courseRepository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  async remove(id: number) {
    const course = await this.courseRepository.findOneBy({ id });
    if (!course) {
      throw new NotFoundException('Khóa học này không tồn tại');
    }
    await this.courseRepository.delete(id);
    return {
      message: `Đã xóa khóa học có id: ${id}`,
    };
  }

  async removeAll() {
    const courses = await this.courseRepository.deleteAll();
    if (courses.affected === 0) {
      throw new NotFoundException('Không có khóa học để xóa');
    }
    return {
      message: `Đã xóa ${courses.affected} khóa học`,
    };
  }
}
