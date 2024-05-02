import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { MovieService } from './movie.service'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { Types } from 'mongoose'
import { Auth } from 'src/auth/decorators/auth.decorators'
import { RolesEnum } from 'src/auth/auth.interface'
import { CreateMovieDto } from './dto/movie.dto'

@Controller('movie')
export class MovieController {
	constructor(private readonly movieService: MovieService) {}

	@Get('by-slug/:slug')
	async getMovieBySlug(@Param('slug') slug: string) {
		return this.movieService.getMovieBySlug(slug)
	}

	@Get('by-actor/:actorId')
	async getMovieByActor(
		@Param('actorId', IdValidationPipe) actorId: Types.ObjectId
	) {
		return this.movieService.getMovieByActor(actorId)
	}

	@Get('by-genres')
	async getMoviesByGenres(@Body('genreIds') genreIds: Types.ObjectId[]) {
		return this.movieService.getMoviesByGenres(genreIds)
	}

	@Get()
	async getAllMovies() {
		return this.movieService.getAllMovies()
	}

	@Get('most-popular')
	async getMostPopularMovies() {
		return this.movieService.getMostPopularMovies()
	}

	@Put('update-count-opened')
	@HttpCode(200)
	async updateCountOpened(@Body('slug') slug: string) {
		return this.movieService.updateCountOpened(slug)
	}

	@Get(':id')
	@Auth(RolesEnum.ADMIN)
	async getMovieById(@Param('id', IdValidationPipe) id: Types.ObjectId) {
		return this.movieService.getMovieById(id)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	async createMovie() {
		return this.movieService.createMovie()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	async updateMovie(
		@Param('id', IdValidationPipe) id: Types.ObjectId,
		@Body() dto: CreateMovieDto
	) {
		return this.movieService.updateMovie(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	async deleteMovie(@Param('id', IdValidationPipe) id: Types.ObjectId) {
		return this.movieService.deleteMovie(id)
	}
}
