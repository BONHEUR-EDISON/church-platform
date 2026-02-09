import { CreateChurchDto } from './create-church.dto';
import { CreateAdminDto } from './create-admin.dto';

export class CreateChurchWithAdminDto {
  church: CreateChurchDto;
  admin: CreateAdminDto;
}
