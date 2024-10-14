import { ApiProperty } from '@nestjs/swagger';

export class BankAccountDTO {
  @ApiProperty()
  description: string;

  @ApiProperty()
  property_id: string;

  @ApiProperty()
  bank: string;

  @ApiProperty()
  agency: string;

  @ApiProperty()
  account: string;

  @ApiProperty()
  keyJ: string;
}

export class FilterBankAccountDTO {
  @ApiProperty({ required: false })
  property_id: string;
}
