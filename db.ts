import mongoose, {connect as MongooseConnect, Connection} from 'mongoose'
import { env } from './config';

export class Database{
    private readonly dbUrl: string;
    private readonly connection: Connection;

    constructor(){
        this.dbUrl = env.MONGO_URI
        this.connection = mongoose.connection
        this.setupDbListeners()
    }

    async connect(){
       await MongooseConnect(this.dbUrl) 
    }

    private setupDbListeners(){
        this.connection.on('connected', () => {
            console.log('MongoDB connection connected.');
          });
      
          this.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error.message);
          });
      
          this.connection.on('disconnected', () => {
            console.warn('MongoDB connection disconnected.');
          });
    }
}