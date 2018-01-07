import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export const EntrySchema = new mongoose.Schema({
  username         : String,
  password            : String,
});
