import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { MONGO_URI } from './constants/mongo.constants'
import { GenreModule } from './genre/genre.module';
import { FileModule } from './file/file.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<string>(MONGO_URI)
			})
		}),
		UserModule,
		AuthModule,
		GenreModule,
		FileModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
