/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { User } from './decorators/user.decorator'
import { UserService } from './user.service'
import { Auth } from 'src/auth/decorators/auth.decorators'
import { UpdateUserDto } from './dto/update-user.dto'
import { RolesEnum } from 'src/auth/auth.interface'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@User('_id') _id: string) {
		return this.userService.getProfile(_id)
	}

	@Get('count')
	@Auth(RolesEnum.ADMIN)
	async getUsersCount() {
		return this.userService.getCountOfUsers()
	}

	@Get()
	@Auth(RolesEnum.ADMIN)
	async getAllUsers(@Query('search') searchTerm?: string) {
		return this.userService.getAllUsers(searchTerm)
	}

	@Get(':id')
	@Auth(RolesEnum.ADMIN)
	async getUser(@Param('id', IdValidationPipe) id: string) {
		return this.userService.getProfile(id)
	}

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(200)
	@Auth()
	async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
		return this.userService.updateProfile(_id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	async updateUserProdile(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfile(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	async deleteUser(@Param('id', IdValidationPipe) id: string) {
		return this.userService.deleteUser(id)
	}
}
