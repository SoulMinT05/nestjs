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
} from 'typeorm';

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

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  refreshToken?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
