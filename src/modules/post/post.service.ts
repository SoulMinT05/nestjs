import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { ICreatePost, IUpdatePost } from './post.controller';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  findAll() {
    return this.postRepository.find({
      relations: ['user'],
    });
  }

  findOne(id: number) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async create(postData: ICreatePost) {
    const { userId, ...excludedUserId } = postData;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['post'],
    });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy user với id: ${userId}`);
    }

    const newPost = this.postRepository.create({
      ...excludedUserId,
      user,
    });
    const savedPost = await this.postRepository.save(newPost);

    return this.postRepository.findOne({
      where: { id: savedPost.id },
      relations: ['user'],
    });
  }

  async update(id: number, postData: IUpdatePost) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) {
      throw new NotFoundException(`Không tìm thấy post với id: ${id}`);
    }

    await this.postRepository.update(id, postData);
    return this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async remove(id: number) {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Không tìm thấy post với id: ${id}');
    }
    await this.postRepository.delete(id);
    return {
      message: `Xóa post với id: ${id} thành công`,
    };
  }
  async removeAllUsers() {
    const posts = await this.postRepository.deleteAll();
    if (posts.affected === 0) {
      throw new NotFoundException({
        message: 'Không tồn tại post để xóa',
      });
    }
    return {
      success: true,
      message: `Đã xóa ${posts.affected} post`,
    };
  }
}
