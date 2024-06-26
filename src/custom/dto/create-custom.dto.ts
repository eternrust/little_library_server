import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateCustomDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	type: 'page' | 'block' | 'date'

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	style: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	data: string

	@IsNumber()
	@ApiProperty()
	parentId: number
}
