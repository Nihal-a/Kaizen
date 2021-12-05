const db = require('../config/connection');
const collections = require('../config/collections');
const { USER_COLLECTIONS, SERVICE_COLLECTIONS, PRODUCTS_COLLECTIONS, ADDON_COLLECTIONS } = require('../config/collections');
const bcrypt = require('bcrypt');
const { ObjectID } = require('mongodb');


module.exports = {
    createllpservice: (user) => {
        console.log(user);
        return new Promise(async (resolve, reject) => {
            let product = await db.get().collection(PRODUCTS_COLLECTIONS).findOne({ name: "plc" })
            console.log(product);
            console.log(user);
            db.get().collection(SERVICE_COLLECTIONS).insertOne({ userid: user, services: [product] }).then((result) => {
                console.log(result.insertedId);
                resolve(result.insertedId)

            }).catch((err) => {
                reject(err)
            })

        })


    },
    getAmount: (id) => {

        return new Promise(async (resolve, reject) => {
            let Totel = await db.get().collection(SERVICE_COLLECTIONS).aggregate([
                {
                    $match: { _id: ObjectID(id) },
                },
                {
                    $unwind: "$services",
                },
                {
                    $group: {
                      _id: null,
                      total: { $sum:  "$services.price" } 
        
                    }
                }
                    

            ]).toArray()
            console.log("totel", Totel);
        })

    },
    addAddons: (id, addonId) => {
        return new Promise(async (resolve, reject) => {
            let addon = await db.get().collection(ADDON_COLLECTIONS).findOne({ _id: ObjectID(addonId) })
            if (addon !== null) {
                await db.get().collection(SERVICE_COLLECTIONS).updateOne(
                    { _id: ObjectID(id) },
                    { $push: {  "services": addon } }
                ).then((result) => {
                    console.log(result);
                })
            }
        })
    }

}