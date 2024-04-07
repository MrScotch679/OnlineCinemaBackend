/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly AuthService: AuthService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(@Body() body: AuthDto) {
		return this.AuthService.register(body)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() body: AuthDto) {
		return this.AuthService.login(body)
	}
}