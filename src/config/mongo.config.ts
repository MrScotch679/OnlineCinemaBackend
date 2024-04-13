import { ConfigService } from '@nestjs/config'
import { TypegooseModuleOptions } from 'nestjs-typegoose'
import { MONGO_URI } from 'src/constants/mongo.constants'

export const getMongoDBConfig = async (
	configService: ConfigService
): Promise<TypegooseModuleOptions> => ({
	uri: configService.get(MONGO_URI)
})
