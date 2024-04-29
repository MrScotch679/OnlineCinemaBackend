/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { GenreService } from './genre.service'
import { Auth } from 'src/auth/decorators/auth.decorators'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { RolesEnum } from 'src/auth/auth.interface'
import { CreateGenreDto } from './dto/create-genre.dto'

@Controller('genre')
export class GenreController {
	constructor(private readonly GenreService: GenreService) {}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.GenreService.findBySlug(slug)
	}

	@Get('collections')
	async getCollections() {
		return this.GenreService.getGenresCollection()
	}

	@Get()
	async getAllGenres(@Query('searchTerm') searchTerm?: string) {
		return this.GenreService.getAllGenres(searchTerm)
	}

	@Get(':id')
	async getGenreById(@Param('id', IdValidationPipe) id: string) {
		return this.GenreService.getGenreById(id)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	async updateGenre(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateGenreDto
	) {
		return this.GenreService.updateGenre(id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	async createGenre() {
		return this.GenreService.createGenre()
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth(RolesEnum.ADMIN)
	async deleteGenre(@Param('id', IdValidationPipe) id: string) {
		return this.GenreService.deleteGenre(id)
	}
}
