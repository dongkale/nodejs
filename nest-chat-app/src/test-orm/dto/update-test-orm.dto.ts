import { IsString } from 'class-validator';

export class UpdateTestOrmDto {
  @IsString()
  name: string;

  @IsString()
  version: string;
}
