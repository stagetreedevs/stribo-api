/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDto {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  last_name: string;

  @ApiProperty({ required: false })
  type: string;

  @ApiProperty({ required: false })
  cpf: string;

  @ApiProperty({ required: false })
  phone: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: Express.Multer.File;

  @ApiProperty({ required: false })
  active?: boolean;
}

export class UpdateUserFirstLoginDto {
  @ApiProperty({ required: false })
  name: string;

  @ApiProperty({ required: false })
  newPassword: string;
}

export class UpdatePasswordDto {
  @ApiProperty() newPassword: string;
}
