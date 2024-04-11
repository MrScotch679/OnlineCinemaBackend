import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { UserModelInterface } from '../user.model'

export const User = createParamDecorator(
	(field: keyof UserModelInterface, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user

		return field ? user[field] : user
	}
)
