import mongoose from "mongoose";

// Serverless invocations reuse the module scope, so cache the connection promise to avoid
// opening a new socket (and a connection storm) on every cold-started request.
type MongooseCache = {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
    _mongooseCache?: MongooseCache;
};

const cache: MongooseCache =
    globalForMongoose._mongooseCache ?? { conn: null, promise: null };

globalForMongoose._mongooseCache = cache;

export const connectToDB = async (): Promise<typeof mongoose> => {
    if (cache.conn) return cache.conn;

    if (!cache.promise) {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error("MONGO_URI is not configured");
        }

        cache.promise = mongoose.connect(mongoUri).then((connection) => {
            console.log("MongoDB Connected");
            return connection;
        });
    }

    try {
        cache.conn = await cache.promise;
    } catch (error) {
        // Reset so the next request can retry instead of reusing a rejected promise.
        cache.promise = null;
        console.log("error in connecting", error);
        throw error;
    }

    return cache.conn;
};

export default connectToDB;
