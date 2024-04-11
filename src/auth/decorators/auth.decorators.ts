import { UseGuards, applyDecorators } from '@nestjs/common'
import { RolesEnum } from '../auth.interface'
import { JwtAuthGuard } from '../guards/jwt.guard'
import { AdminGuard } from '../guards/admin.guard'

export const Auth = (role?: RolesEnum) =>
	applyDecorators(
		role === RolesEnum.ADMIN
			? UseGuards(JwtAuthGuard, AdminGuard)
			: UseGuards(JwtAuthGuard)
	)
