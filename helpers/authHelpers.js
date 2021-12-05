const db = require('../config/connection');
const collections = require('../config/collections');
const { USER_COLLECTIONS } = require('../config/collections');
const bcrypt = require('bcrypt')
require('dotenv').config()
const ACCOUNT_SID = process.env.ACCOUNT_SID
const AUTH_TOKEN = process.env.AUTH_TOKEN
const SERVICE_ID = process.env.SERVICE_ID
const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);


module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      const { email, password, name } = userData

      let emailExist = await db.get().collection(USER_COLLECTIONS).findOne({ email: email })

      if (emailExist) {
        console.log(emailExist);

        reject({ SignupStatus: false, message: "user already exist" })
      } else {
        hashPassword = await bcrypt.hash(password, 10)

        db.get().collection(USER_COLLECTIONS).insertOne({ email, name, hashPassword }).then((response) => {
          console.log(response);
          db.get().collection(USER_COLLECTIONS).findOne({_id:response.insertedId}).then((user)=>{


            resolve({ SignupStatus: true ,user})
            
          })

        }).catch((err) => {

          reject({ SignupStatus: false, message: "signup error " })

        })

      }



    })

  },

  doLogin: ({email,password}) => {
    console.log(email,password);
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let user = await db.get().collection(collections.USER_COLLECTIONS).findOne({ email:email });
      console.log(user);
      if (user) {

        bcrypt.compare(password, user.hashPassword ).then(function(result) {
          console.log(result);
          if (result) {
            console.log("login success");
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            console.log("login failed 1");
            reject({ status: false ,message:"invalid username or password"});
          }
        });
       
        
      } else {
        console.log("login failed 2");
        reject({ status: false, message:"email not exist" });
      }
    });
  },

}