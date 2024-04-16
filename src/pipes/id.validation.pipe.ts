import {
	ArgumentMetadata,
	BadRequestException,
	PipeTransform
} from '@nestjs/common'
import { Types } from 'mongoose'

export class IdValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		if (metadata.type === 'param') {
			return value
		}

		if (Types.ObjectId.isValid(value)) {
			return value
		}

		return new BadRequestException('Id is not valid')
	}
}
