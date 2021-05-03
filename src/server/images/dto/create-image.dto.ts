import { ApiProperty } from "@nestjs/swagger"

export class CreateImageDto {
    @ApiProperty({example: "joedoe", description: "The name of the image"})
    fileName: string
    @ApiProperty({example: "/image/joedoe.jpg", description: "The path of the image resource"})
    filePath: string
}
