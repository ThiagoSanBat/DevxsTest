import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'Joe', description: 'The name of the user' })
  email?: string;
  @ApiProperty({ example: '******', description: 'The email of the user' })
  password: string;
}
