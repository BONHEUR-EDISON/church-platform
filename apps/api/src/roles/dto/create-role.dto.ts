// create-role.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
