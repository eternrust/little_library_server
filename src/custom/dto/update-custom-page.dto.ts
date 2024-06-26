import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsArray } from 'class-validator'
import { UpdateCustomDto } from './update-custom.dto'
import { UpdateCustomNodeDto } from './update-custom-node.dto'

export class UpdateCustomPageDto {
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
	node: UpdateCustomNodeDto[]
}
