import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/user/entities/user.entity'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private jwtService: JwtService
	) {}

	async signIn(email: string, password: string): Promise<any> {
		const user: User | undefined = await this.userRepository.findOne({
			where: { email }
		})

		const comparePassword = await bcrypt.compare(password, user.password)
		if (!comparePassword) {
			throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다.')
		}
		const payload = { sub: user.id, username: user.name }
		console.log(await this.jwtService.signAsync(payload))
		return {
			access_token: await this.jwtService.signAsync(payload)
		}
	}
}
