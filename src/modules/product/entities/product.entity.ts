import slugify from 'slugify';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  slug: string;
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('simple-array', { nullable: true })
  images: [string];

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  oldPrice: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ default: 500 })
  count_in_stock: number;
  @Column({ default: 0 })
  quantity_sold: number;
  @Column({ default: 0 })
  average_rating: number;
  @Column({ default: 0 })
  review_count: number;

  @Column({ default: true })
  is_featured: boolean;
  @Column({ default: true })
  is_published: boolean;

  @Column('simple-array', { nullable: true })
  product_size: [string];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @BeforeInsert()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  generatePrice() {
    this.price =
      this.oldPrice > 0 ? this.oldPrice - this.oldPrice * this.discount : 0;
  }
}
