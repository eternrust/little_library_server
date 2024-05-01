import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	name: string

	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	password: string

	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	email: string
}
