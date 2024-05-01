import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignInUserDto {
	@IsString()
	@IsNotEmpty()
	@ApiProperty()
	password: string

	@IsEmail()
	@IsNotEmpty()
	@ApiProperty()
	email: string
}
