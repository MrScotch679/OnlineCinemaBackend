import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { RatingService } from './rating.service'
import { Auth } from 'src/auth/decorators/auth.decorators'
import { Types } from 'mongoose'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { User } from 'src/user/decorators/user.decorator'
import { RatingDto } from './dto/rating.dto'

@Controller('rating')
export class RatingController {
	constructor(private readonly ratingService: RatingService) {}

	@Get(':movieId')
	@Auth()
	async getMovieRatingByUser(
		@Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
		@User('_id') userId: Types.ObjectId
	) {
		return this.ratingService.getMovieRatingByUser(movieId, userId)
	}

	@UsePipes(new ValidationPipe())
	@Post('set-rating')
	@HttpCode(200)
	@Auth()
	async setMovieRating(
		@User('_id') userId: Types.ObjectId,
		@Body() dto: RatingDto
	) {
		return this.ratingService.setMovieRating(userId, dto)
	}
}
