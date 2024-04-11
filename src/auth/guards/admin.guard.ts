import {
	CanActivate,
	ExecutionContext,
	ForbiddenException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserModelInterface } from 'src/user/user.model'

export class AdminGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context
			.switchToHttp()
			.getRequest<{ user: UserModelInterface }>()

		const user = request.user

		if (!user.isAdmin) {
			throw new ForbiddenException('Access denied')
		}

		return user.isAdmin
	}
}
