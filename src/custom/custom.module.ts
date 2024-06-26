import { Module } from '@nestjs/common'
import { CustomService } from './custom.service'
import { CustomController } from './custom.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Custom } from './entities/custom.entity'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from 'src/auth/auth.guard'
import { User } from 'src/user/entities/user.entity'
import { UserService } from 'src/user/user.service'
import { AuthService } from 'src/auth/auth.service'
import { RefreshToken } from 'src/auth/entities/refreshToken.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Custom, User, RefreshToken]), ],
	controllers: [CustomController],
	providers: [
		CustomService,
		UserService,
		AuthService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard
		}
	]
})
export class CustomModule {}
