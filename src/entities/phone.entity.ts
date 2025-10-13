import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('phone')
export class Phone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @OneToOne(() => User, (user) => user.phone, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
