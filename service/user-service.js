const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const tokenService = require('../service/token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')
const { ObjectId } = require('mongodb')

class UserService {
   async registration(email, password, name) {
      const candidate = await UserModel.findOne({ email })
      if (candidate) {
         throw ApiError.BadRequest(
            `Пользователь с таким ${email} уже существует`,
         )
      }
      const hashPassword = await bcrypt.hash(password, 3)
      const user = await UserModel.create({
         email,
         password: hashPassword,
         name,
      })
      const userDto = new UserDto(user)
      const tokens = tokenService.generateTokens({ ...userDto })
      await tokenService.saveToken(userDto.id, tokens.refreshToken)

      return {
         ...tokens,
         user: userDto,
      }
   }

   async login(email, password) {
      const user = await UserModel.findOne({ email })
      if (!user) {
         throw ApiError.BadRequest('User is not found')
      }

      const isPassEqual = await bcrypt.compare(password, user.password)
      if (!isPassEqual) {
         throw ApiError.BadRequest('Incorrect password')
      }
      const userDto = new UserDto(user)
      const tokens = tokenService.generateTokens({ ...userDto })
      await tokenService.saveToken(userDto.id, tokens.refreshToken)

      return {
         ...tokens,
         user: userDto,
      }
   }

   async logout(refreshToken) {
      const token = await tokenService.removeToken(refreshToken)
      return token
   }

   async refresh(refreshToken) {
      if (!refreshToken) {
         throw ApiError.UnauthorizedError()
      }
      const userData = tokenService.validateToken(refreshToken)
      const tokenFromDB = await tokenService.findToken(refreshToken)

      if (!userData || !tokenFromDB) {
         throw ApiError.UnauthorizedError()
      }
      const user = await UserModel.findById(userData.id)
      const userDto = new UserDto(user)
      const tokens = tokenService.generateTokens({ ...userDto })

      await tokenService.saveToken(userDto.id, tokens.refreshToken)

      return {
         ...tokens,
         user: userDto,
      }
   }

   async getAllUsers(page, size) {
      // const users = await UserModel.find().skip(page).limit(size)
      // const numUsers = await UserModel.estimatedDocumentCount()

      const options = {
         page: parseInt(page, 10),
         limit: parseInt(size, 10),
      }
      const users = await UserModel.paginate({}, options)
      if (!users) {
         throw ApiError.BadRequest(`Some error occurred while retrieving data`)
      }
      //return { users, numUsers }
      return users
   }

   async getProfile(id) {
      const profile = await UserModel.findOne(
         { _id: new ObjectId(id) },
         { password: 0 },
      )
      return profile
   }

   async setProfileStatus(id, newStatus) {
      const profile = await UserModel.updateOne(
         { _id: new ObjectId(id) },
         { $set: { status: newStatus } },
         // { projection: 'status' },
      )

      const profileStatus = await UserModel.find(
         { _id: new ObjectId(id) },
         { status: 1 },
      )

      return profileStatus
   }

   async setProfilePhotos(id, photo) {
      const profile = await UserModel.updateOne(
         { _id: new ObjectId(id) },
         { $set: { coverImage: photo } },
      )
      return profile
   }
}

module.exports = new UserService()

