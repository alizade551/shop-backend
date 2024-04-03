import { IsEmail, IsPhoneNumber, IsString, Length } from 'class-validator';
import { IsPassword } from 'src/common/decorators/validators/is-password.decorators';

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  readonly name: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsPhoneNumber('AZ')
  readonly phone: string;

  /**
   
   * 1. 8 to 20 characters
   * 2. At least one
   * - Lowercase letter
   * - Uppercase letter
   * - Number
   * - Special character
   */
  @IsString()
  @IsPassword()
  readonly password: string;
}
