import { Body, Controller, HttpCode, HttpStatus, Get, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInUserDto } from 'src/user/dto'
import { Public } from './auth.guard'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@HttpCode(HttpStatus.OK)
	@Get('login')
	@Public()
	signIn(@Body() signInDto: SignInUserDto) {
		console.log(signInDto)
		// return this.authService.signIn(signInDto.email, signInDto.password)
	}

	@Get('profile')
	getProfile(@Request() req) {
		return req.user
	}
}
