import { Controller, Post, Body, Get, Request, Param, Patch, Delete } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { SignInUserDto } from './dto/signin-user.dto'
import { ApiParam, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/auth/auth.guard'
import { UpdateUserDto } from './dto'

@ApiTags('user')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Public()
	@Post('signup')
	async signUp(@Body() body: CreateUserDto) {
		return await this.userService.signUp(body)
	}

	@Public()
	@Post('login')
	async login(@Body() body: SignInUserDto) {
		return await this.userService.signIn(body)
	}

	@Get('profile/me')
	async myProfile(@Request() req) {
		return await this.userService.find(req.user, req.user.id)
	}

	@ApiParam({
		name: 'id',
		description: '유저 id'
	})
	@Get('profile/:id')
	async profile(@Request() req, @Param('id') id) {
		return await this.userService.find(req.user, id)
	}

	@Patch('profile')
	async changeProfile(@Request() req, @Body() body: UpdateUserDto) {
		return await this.userService.change(req.user, body)
	}

	@Delete('quit')
	async quit(@Request() req) {
		return await this.userService.quit(req.user)
	}
}
