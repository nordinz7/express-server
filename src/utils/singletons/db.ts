import { MongoClient } from 'mongodb'
import { dbMongoConnectionString } from '../../config'

export const DbSingleton = (function () {
  let instance
  return {
    getInstance: async (): Promise<any> => {
      if (instance != null) {
        return instance
      }

      const dbUrl = dbMongoConnectionString

      const mongoClient = new MongoClient(dbUrl)
      await mongoClient.connect()
      const db = mongoClient.db()

      const collections = [
        'users'
      ]

      const dbCollections = collections.reduce((cols: any, cName: string) => {
        cols[cName] = db.collection(cName)

        return cols
      }, {})

      instance = dbCollections
      instance.constructor = null

      return instance
    }
  }
})()
