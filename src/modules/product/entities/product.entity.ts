import slugify from 'slugify';
import { Category } from 'src/modules/category/entities/category.entity';
import { ProductSize } from 'src/product-size/entities/product-size.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
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
  @Column({ nullable: true })
  categorySlug: string;
  @Column({ nullable: true })
  subCategorySlug: string;
  @Column({ nullable: true })
  thirdSubCategorySlug: string;

  @Column({ nullable: true })
  categoryId: number;
  @Column({ nullable: true })
  categoryName: string;
  @Column({ nullable: true })
  subCategoryId: number;
  @Column({ nullable: true })
  subCategoryName: string;
  @Column({ nullable: true })
  thirdSubCategoryId: number;
  @Column({ nullable: true })
  thirdSubCategoryName: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn()
  category: Category;

  @Column({ nullable: true })
  brand: string;
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
  countInStock: number;
  @Column({ default: 0 })
  quantitySold: number;
  @Column({ default: 0 })
  averageRating: number;
  @Column({ default: 0 })
  reviewCount: number;

  @Column({ default: true })
  isFeatured: boolean;
  @Column({ default: true })
  isPublished: boolean;

  @ManyToMany(() => ProductSize, (productSize) => productSize.products, {
    cascade: true, // cho phép tự động insert size mới khi tạo product
  })
  @JoinTable()
  productSizes: ProductSize[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.name, { lower: true, strict: true, locale: 'vi' });
    if (this.categoryName) {
      this.categorySlug = slugify(this.categoryName, {
        lower: true,
        strict: true,
        locale: 'vi',
      });

      if (this.subCategoryName) {
        this.subCategorySlug = slugify(this.subCategoryName, {
          lower: true,
          strict: true,
          locale: 'vi',
        });

        if (this.thirdSubCategoryName) {
          this.thirdSubCategorySlug = slugify(this.thirdSubCategoryName, {
            lower: true,
            strict: true,
            locale: 'vi',
          });
        }
      }
    }
  }
  @BeforeInsert()
  @BeforeUpdate()
  generatePrice() {
    this.price =
      this.oldPrice > 0
        ? this.oldPrice - this.oldPrice * (this.discount / 100)
        : 0;
  }
}
