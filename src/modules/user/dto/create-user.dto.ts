import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Tên phải là ký tự' })
  @IsNotEmpty({ message: 'Cần nhập tên' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Cần nhập email' })
  email: string;

  @IsStrongPassword()
  @IsNotEmpty({ message: 'Cần nhập mật khẩu' })
  password: string;
}
