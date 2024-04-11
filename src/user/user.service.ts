import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from './user.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Injectable, NotFoundException } from '@nestjs/common'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>
	) {}

	async getProfile(id: string) {
		const user = await this.userModel.findById(id).exec()

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return user
	}
}
