import { IsString } from 'class-validator';
export class CreateTestOrmDto {
  @IsString()
  name: string;

  @IsString()
  version: string;
}
