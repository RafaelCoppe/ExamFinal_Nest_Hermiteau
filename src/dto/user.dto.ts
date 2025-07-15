import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  first_name: string;
}
