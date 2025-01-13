import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<MongooseModuleFactoryOptions> => {
        return {
          uri: configService.get<string>('MONGODB_URI'),
        } as MongooseModuleFactoryOptions;
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
