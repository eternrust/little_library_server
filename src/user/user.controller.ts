import { Controller, Post, Body, Get } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { SignInUserDto } from './dto/signin-user.dto'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('signup')
	async signUp(@Body() body: CreateUserDto) {
		return await this.userService.signUp(body)
	}

	@Get('login')
	async login(@Body() body: SignInUserDto) {
		return await this.userService.signIn(body)
	}
}
