import { IsString, IsOptional, IsDateString } from "class-validator";

export class CreateChurchDto {
  @IsString()
  name: string;

  @IsString()
  pastorName: string;

  @IsOptional()
  @IsString()
  agreementNo?: string;

  @IsDateString()
  foundedAt: string;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  address: string;
}
