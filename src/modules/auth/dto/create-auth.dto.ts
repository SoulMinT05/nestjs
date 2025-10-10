import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateAuthDto {
  @IsString({ message: 'Tên phải là ký tự' })
  @IsNotEmpty({ message: 'Cần nhập tên' })
  name: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Cần nhập email' })
  email: string;

  @IsStrongPassword(
    {},
    {
      message:
        'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt',
    },
  )
  @IsNotEmpty({ message: 'Cần nhập mật khẩu' })
  password: string;
}
