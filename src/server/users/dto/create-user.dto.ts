import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Joe', description: 'The name of the user' })
  name?: string;
  @ApiProperty({ example: 'joe@doe.com', description: 'The email of the user' })
  email: string;
  @ApiProperty({ example: '****', description: 'The password of the user' })
  password: string;
  @ApiProperty({ example: 'ADMIN', description: 'The role of the user' })
  role: string;
}
