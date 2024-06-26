import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsArray } from 'class-validator'
import { CreateCustomDto } from './create-custom.dto'

export class CreateCustomPageDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	style: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	data: string

	@IsArray()
	@ApiProperty()
	node: CreateCustomDto[]
}
