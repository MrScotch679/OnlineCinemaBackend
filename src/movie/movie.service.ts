import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { MovieModel } from './movie.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { ErrorMessages } from 'src/constants/error-messages'
import { Types } from 'mongoose'
import { CreateMovieDto } from './dto/movie.dto'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>
	) {}

	async getMovieById(id: Types.ObjectId) {
		const movie = await this.MovieModel.findById(id)

		if (!movie) {
			throw new NotFoundException(ErrorMessages.MOVIE_NOT_FOUND)
		}

		return movie
	}

	async getMovieBySlug(slug: string) {
		const movie = await this.MovieModel.findOne({ slug })
			.populate('actors genres')
			.exec()

		if (!movie) {
			throw new NotFoundException(ErrorMessages.MOVIE_NOT_FOUND)
		}

		return movie
	}

	async getMovieByActor(actorId: Types.ObjectId) {
		const movie = await this.MovieModel.find({ actors: actorId }).exec()

		if (!movie) {
			throw new NotFoundException(ErrorMessages.MOVIE_NOT_FOUND)
		}

		return movie
	}

	async getMoviesByGenres(genreIds: Types.ObjectId[]) {
		const movies = await this.MovieModel.find({
			genres: { $in: genreIds }
		}).exec()

		if (!movies) {
			throw new NotFoundException(ErrorMessages.MOVIE_NOT_FOUND)
		}

		return movies
	}

	async getMostPopularMovies() {
		const movies = await this.MovieModel.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec()

		if (!movies) {
			throw new NotFoundException(ErrorMessages.MOVIE_NOT_FOUND)
		}

		return movies
	}

	async updateCountOpened(slug: string) {
		const updatedMovie = await this.MovieModel.findOneAndUpdate(
			{ slug },
			{
				$inc: { countOpened: 1 }
			},
			{
				new: true
			}
		).exec()

		if (!updatedMovie) {
			throw new NotFoundException(ErrorMessages.MOVIE_NOT_FOUND)
		}

		return updatedMovie
	}

	async getAllMovies(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i')
					}
				]
			}
		}

		return this.MovieModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.populate('actors genres')
			.exec()
	}

	async createMovie() {
		const defaultValue: CreateMovieDto = {
			bigPoster: '',
			actors: [],
			genres: [],
			poster: '',
			title: '',
			slug: '',
			videoUrl: ''
		}

		const movie = await this.MovieModel.create(defaultValue)
		return movie._id
	}

	async updateMovie(id: Types.ObjectId, dto: CreateMovieDto) {
		const updatedMovie = await this.MovieModel.findByIdAndUpdate(id, dto, {
			new: true
		})

		if (!updatedMovie) {
			throw new NotFoundException(ErrorMessages.MOVIE_NOT_FOUND)
		}

		return updatedMovie
	}

	async deleteMovie(id: Types.ObjectId) {
		const deletedMovie = await this.MovieModel.findByIdAndDelete(id).exec()

		if (!deletedMovie) {
			throw new NotFoundException(ErrorMessages.MOVIE_NOT_FOUND)
		}

		return deletedMovie
	}
}
