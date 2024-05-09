import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/user/entities/user.entity'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { RefreshToken } from './entities/refreshToken.entity'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(RefreshToken)
		private readonly refreshTokenReposiory: Repository<RefreshToken>,
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	async generateAccessToken(user: User): Promise<string> {
		const payload = { id: user.id, name: user.name }
		return await this.jwtService.signAsync(payload)
	}

	async generateRefreshToken(user: User): Promise<string> {
		const payload = { id: user.id }
		const token: RefreshToken | undefined = await this.refreshTokenReposiory.findOne({
			where: { userId: user.id }
		})

		if (token && !token.isBlocked) {
			return token.refreshToken
		} else {
			const refreshToken = await this.jwtService.signAsync(payload, {
				secret: this.configService.get('JWT_REFRESH_SECRET'),
				expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME')
			})
			const refresh = this.refreshTokenReposiory.create({
				userId: user.id,
				refreshToken,
				expiredAt: new Date(Date.now())
			})
			this.refreshTokenReposiory.save(refresh)
			return refreshToken
		}
	}
}
