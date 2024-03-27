import { IsEmail } from 'class-validator';
import { IsPassword } from 'src/common/decorators/validators/is-password.decorators';

export class LoginDto {
  @IsEmail()
  readonly email: string;

  @IsPassword()
  readonly password: string;
}
