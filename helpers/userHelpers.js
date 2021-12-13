const db = require('../config/connection');
const collections = require('../config/collections');
const { USER_COLLECTIONS, SERVICE_COLLECTIONS, PRODUCTS_COLLECTIONS, ADDON_COLLECTIONS } = require('../config/collections');
const bcrypt = require('bcrypt');
const { ObjectID } = require('mongodb');
const { response } = require('express');


module.exports = {
    createService: (user, service) => {

        return new Promise(async (resolve, reject) => {
            let product = await db.get().collection(PRODUCTS_COLLECTIONS).findOne({ name: service })

            db.get().collection(SERVICE_COLLECTIONS).insertOne({ userid: user, services: [product] }).then((result) => {
                console.log(result.insertedId);
                resolve(result.insertedId)

            }).catch((err) => {
                reject(err)
            })

        })


    },
    getAmount: (id) => {
        try {


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
                            _id: "$_id",
                            total: { $sum: "$services.price" }

                        }
                    }


                ]).toArray()
                console.log("totel", Totel);
                resolve(Totel)
            })
        }catch(error){

            reject(error)

        }

    },

    addAddress: (id) => {
        return new Promise(async (resolve, reject) => {
            let addon = await db.get().collection(ADDON_COLLECTIONS).findOne({ name: "VAddress" })
            if (addon !== null) {
                await db.get().collection(SERVICE_COLLECTIONS).updateOne(
                    { _id: ObjectID(id) },
                    { $push: { "services": addon } }
                ).then((result) => {
                    console.log(result);
                })
            }
        })
    },


    addAddons: (id, addonname) => {
        console.log(id,addonname);
        return new Promise(async (resolve, reject) => {
            let addon = await db.get().collection(ADDON_COLLECTIONS).findOne({ name:addonname })
            console.log(addon);
            if (addon !== null) {
                await db.get().collection(SERVICE_COLLECTIONS).updateOne(
                    { _id: ObjectID(id) },
                    { $push: { "services": addon } }
                ).then((result) => {
                   resolve(result)
                    
                })
            }
        })
    }

}