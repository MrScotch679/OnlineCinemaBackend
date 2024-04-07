import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel, UserModelInterface } from 'src/user/user.model'
import { AuthDto } from './dto/auth.dto'
import { compare, genSalt, hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
		private readonly jwtService: JwtService
	) {}

	async register(body: AuthDto) {
		const oldUser = await this.findUser(body.email)

		if (oldUser) {
			throw new BadRequestException('User already exists')
		}

		const salt = await genSalt()

		const newUser = new this.UserModel({
			email: body.email,
			password: await hash(body.password, salt)
		})

		const tokens = await this.createPaidToken(String(newUser._id))

		return {
			user: this.getUserFields(newUser as UserModelInterface),
			...tokens
		}
	}

	async login(body: AuthDto) {
		const user = await this.validateUser(body)

		const tokens = await this.createPaidToken(String(user._id))

		return {
			user: this.getUserFields(user as UserModelInterface),
			...tokens
		}
	}

	async createPaidToken(userId: string) {
		const data = { _id: userId }

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '15d'
		})

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '1h'
		})

		return { accessToken, refreshToken }
	}

	async validateUser(body: AuthDto) {
		const currentUser = await this.findUser(body.email)

		if (!currentUser) {
			throw new UnauthorizedException('User not found')
		}

		const isValidPassword = await compare(body.password, currentUser.password)

		if (!isValidPassword) {
			throw new UnauthorizedException('Invalid password')
		}

		return currentUser
	}

	async findUser(email: string) {
		const user = await this.UserModel.findOne({ email })

		return user
	}

	getUserFields(user: UserModelInterface) {
		return {
			_id: user._id,
			email: user.email,
			isAdmin: user.isAdmin
		}
	}
}
