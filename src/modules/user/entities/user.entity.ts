import { Phone } from 'src/entities/phone.entity';
import { Post } from '../../post/entities/post.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Course } from 'src/modules/course/entities/course.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @OneToOne(() => Phone, (phone) => phone.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  phone: Phone;

  @OneToMany(() => Post, (post) => post.user, { onDelete: 'CASCADE' })
  post: Post[];

  @ManyToMany(() => Course, (course) => course.users, { onDelete: 'CASCADE' })
  @JoinTable()
  courses: Course[];

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  refreshToken?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
