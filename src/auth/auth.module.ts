import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { User } from 'src/user/entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { RefreshToken } from './entities/refreshToken.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([User, RefreshToken]),
		PassportModule.register({
			defaultStrategy: 'jwt',
			session: false
		}),
		JwtModule.registerAsync({
			global: true,
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				secret: config.get<string>('JWT_ACCESS_SECRET'),
				signOptions: {
					expiresIn: config.get<string>('JWT_ACCESS_EXPIRATION_TIME')
				}
			})
		})
	],
	controllers: [],
	providers: [AuthService],
	exports: [AuthService]
})
export class AuthModule {}
