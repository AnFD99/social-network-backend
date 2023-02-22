const { Schema, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const UserSchema = new Schema({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      unique: true,
      required: true,
   },
   password: {
      type: String,
      required: true,
   },
   coverImage: {
      type: String,
      default: '',
   },
   avatarImage: {
      type: String,
      default: '',
   },
   location: {
      city: { type: String, default: '' },
      country: { type: String, default: '' },
   },
   status: { type: String, default: '' },
   friends: [
      {
         friend: {
            type: Schema.Types.ObjectId,
            ref: 'User',
         },
      },
   ],
})

UserSchema.plugin(mongoosePaginate)

module.exports = model('User', UserSchema)



