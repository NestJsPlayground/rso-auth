import { Connection } from 'mongoose';
import { EntrySchema } from './schema';

export const entryProviders = [
  {
    provide: 'EntryModelToken',
    useFactory: (connection: Connection) => connection.model('User', EntrySchema),
    inject: ['DbConnectionToken'],
  },
];
