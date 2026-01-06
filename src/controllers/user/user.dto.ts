/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class UserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: Express.Multer.File;

  @ApiProperty({ required: false })
  active?: boolean;
}
export class UserGoogleDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  picture: string;
}
