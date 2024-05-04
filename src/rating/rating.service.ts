import { Injectable } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { RatingModel } from './rating.model'
import { MovieService } from 'src/movie/movie.service'
import { Types } from 'mongoose'
import { RatingDto } from './dto/rating.dto'

@Injectable()
export class RatingService {
	constructor(
		@InjectModel(RatingModel)
		private readonly ratingModel: ModelType<RatingModel>,
		private readonly movieService: MovieService
	) {}

	async getMovieRatingByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
		return await this.ratingModel
			.findOne({ movie: movieId, user: userId })
			.select('value')
			.exec()
			.then((rating) => rating?.value || 0)
	}

	async setMovieRating(userId: Types.ObjectId, dto: RatingDto) {
		const { movieId, value } = dto

		const newRating = await this.ratingModel
			.findOneAndUpdate(
				{ movie: movieId, user: userId },
				{
					movie: movieId,
					user: userId,
					value
				},
				{
					new: true,
					upsert: true,
					setDefaultsOnInsert: true
				}
			)
			.exec()

		const averageRating = await this.averageRatingByMovie(movieId)

		await this.movieService.updateMovieRating(movieId, averageRating)

		return newRating
	}

	async averageRatingByMovie(movieId: Types.ObjectId) {
		const movieRatings = await this.ratingModel
			.aggregate()
			.match({
				movie: new Types.ObjectId(movieId)
			})
			.exec()

		const averageMovieRating =
			movieRatings.reduce((acc, item) => acc + item.value, 0) /
			movieRatings.length

		return averageMovieRating
	}
}
