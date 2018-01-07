import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserController } from './user.controller';
import { entryProviders } from './user.providers';

@Module({
    controllers: [
      UserController
    ],
    modules: [
      DatabaseModule
    ],
    components: [
      ...entryProviders
    ],
})
export class UserModule {}
