import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateCustomDto } from './create-custom.dto'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateCustomNodeDto extends PartialType(CreateCustomDto) {
    @IsString()
    @ApiProperty()
    id: number
}
