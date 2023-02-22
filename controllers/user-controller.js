const userService = require('../service/user-service')
const ApiError = require('../exceptions/api-error')

const { validationResult } = require('express-validator')

class UserController {
   async registration(req, res, next) {
      try {
         const errors = validationResult(req)
         if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Validation error', errors.array()))
         }
         const { email, password, name } = req.body
         const userData = await userService.registration(email, password, name)
         res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
         })
         return res.json(userData)
      } catch (err) {
         next(err)
      }
   }

   async login(req, res, next) {
      try {
         const { email, password } = req.body
         const userData = await userService.login(email, password)
         res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
         })

         return res.json(userData)
      } catch (err) {
         next(err)
      }
   }

   async logout(req, res, next) {
      try {
         const { refreshToken } = req.cookies
         const token = await userService.logout(refreshToken)
         res.clearCookie('refreshToken')
         return res.json(token)
      } catch (err) {
         next(err)
      }
   }

   async refresh(req, res, next) {
      try {
         const { refreshToken } = req.cookies
         const userData = await userService.refresh(refreshToken)
         res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
         })
         return res.json(userData)
      } catch (err) {
         next(err)
      }
   }

   async getUsers(req, res, next) {
      try {
         const page = req.query.page || 1
         const size = req.query.size || 3

         const users = await userService.getAllUsers(page, size)
         return res.json(users)
      } catch (err) {
         next(err)
      }
   }

   async getProfile(req, res, next) {
      try {
         const profileId = req.params.id
         const profile = await userService.getProfile(profileId)
         return res.json(profile)
      } catch (err) {
         next(err)
      }
   }

   async setStatus(req, res, next) {
      try {
         const profileId = req.params.id
         const status = req.body.status
         const profile = await userService.setProfileStatus(profileId, status)
         return res.json(profile)
      } catch (err) {
         next(err)
      }
   }

   async setPhoto(req, res, next) {
      try {
         const profileId = req.params.id
         const photo = req.body.photo
         const profile = await userService.setProfilePhotos(profileId, photo)
         return res.json(profile)
      } catch (err) {
         next(err)
      }
   }
}

module.exports = new UserController()

