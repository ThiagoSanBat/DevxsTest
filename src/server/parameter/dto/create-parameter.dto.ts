import { ApiProperty } from "@nestjs/swagger"

export class CreateParameterDto {
    @ApiProperty({example: "expirationDate", description: "The key for parameter"})
    key: string
    @ApiProperty({example: "15", description: "The value for parameter"})
    value: string
}
