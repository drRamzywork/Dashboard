// import mongoose from 'mongoose'

// const MONGO_URI =
//   'mongodb+srv://elshenawy:test1234@cluster0.wvnumfn.mongodb.net/dashboard-db?retryWrites=true&w=majority'

// if (!MONGO_URI) {
//   throw new Error('Please define the MONGO_URI environment variable inside .env.local')
// }

// let cached = global.mongoose

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null }
// }

// async function dbConnect() {
//   if (cached.conn) {
//     return cached.conn
//   }

//   if (!cached.promise) {
//     const opts = {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     }

//     cached.promise = mongoose.connect(MONGO_URI, opts).then(mongoose => {
//       return mongoose
//     })
//   }
//   cached.conn = await cached.promise
//   return cached.conn
// }

// export default dbConnect

// utils/dbConnect.js
import mongoose from 'mongoose'

const MONGO_URI =
  'mongodb+srv://elshenawy:test1234@cluster0.wvnumfn.mongodb.net/dashboard-db?retryWrites=true&w=majority'
if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env.local')
}

let cached = global.mongoose
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }

    cached.promise = mongoose.connect(MONGO_URI, opts).then(mongoose => {
      return {
        conn: mongoose,
        connClient: mongoose.connection.getClient() // Export the native client connection
      }
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
