import { InjectModel } from 'nestjs-typegoose'
import { UserModel, UserModelInterface } from './user.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Injectable, NotFoundException } from '@nestjs/common'
import { UpdateUserDto } from './dto/update-user.dto'
import { genSalt, hash } from 'bcryptjs'
import { Types } from 'mongoose'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
	) {}

	async getProfile(id: string) {
		const user = await this.UserModel.findById(id).exec()

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return user
	}

	async updateProfile(_id: string, dto: UpdateUserDto) {
		const user = await this.getProfile(_id)
		const existedEmail = await this.UserModel.findOne({ email: dto.email })

		if (existedEmail && String(_id) !== String(existedEmail?._id)) {
			throw new NotFoundException('Email already exists')
		}

		if (dto.password) {
			const salt = await genSalt()
			dto.password = await hash(dto.password, salt)
		}

		user.email = dto.email

		if (dto.isAdmin) {
			user.isAdmin = dto.isAdmin
		}

		await user.save()

		return 'Profile updated'
	}

	async getCountOfUsers() {
		return this.UserModel.find().countDocuments().exec()
	}

	async getAllUsers(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						email: new RegExp(searchTerm, 'i')
					}
				]
			}
		}

		return this.UserModel.find(options)
			.select('-password -__v, -updatedAt')
			.sort({
				createdAt: 'desc'
			})
			.exec()
	}

	async deleteUser(id: string) {
		this.UserModel.findByIdAndDelete(id).exec()
	}

	async toggleFavoriteMovie(movieId: Types.ObjectId, user: UserModelInterface) {
		const { _id, favorites } = user

		return this.UserModel.findByIdAndUpdate(_id, {
			favorites: !favorites.includes(movieId)
				? [...favorites, movieId]
				: favorites.filter((id) => String(id) !== String(movieId))
		})
	}

	async getFavoriteMovies(id: Types.ObjectId) {
		return this.UserModel.findById(id, 'favorites')
			.populate({
				path: 'favorites',
				populate: { path: 'genres' }
			})
			.exec()
			.then((user) => user.favorites)
	}
}
