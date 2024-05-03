import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
		private reflector: Reflector
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass()
		])
		if (isPublic) {
			// 💡 See this condition
			return true
		}

		const request = context.switchToHttp().getRequest()
		const token = this.extractTokenFromHeader(request)
		if (!token) {
			throw new UnauthorizedException('토큰이 없습니다.')
		}
		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get('JWT_SECRET')
			})
			// 💡 We're assigning the payload to the request object here
			// so that we can access it in our route handlers
			request['user'] = payload
		} catch {
			throw new UnauthorizedException('만료된 토큰입니다.')
		}
		return true
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? []
		return type === 'Bearer' ? token : undefined
	}
}
