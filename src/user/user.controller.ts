import { Controller, Get } from '@nestjs/common'
import { User } from './decorators/user.decorator'
import { UserService } from './user.service'
import { Auth } from 'src/auth/decorators/auth.decorators'

@Controller('user')
export class UserController {
	constructor(private readonly UserService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@User('_id') _id: string) {
		return this.UserService.getProfile(_id)
	}
}
