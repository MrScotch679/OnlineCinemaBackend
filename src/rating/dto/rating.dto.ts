import { IsNumber } from 'class-validator'
import { IsObjectId } from 'class-validator-mongo-object-id'
import { Types } from 'mongoose'

export class RatingDto {
	@IsObjectId()
	movieId: Types.ObjectId

	@IsNumber()
	value: number
}
