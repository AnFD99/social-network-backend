module.exports = class ProfileDto {
   email
   id
   name
   coverImage
   avatarImage
   location
   status

   constructor(model) {
      this.email = model.email
      this.id = model._id
      this.name = model.name
      this.coverImage = model.coverImage
      this.avatarImage = model.avatarImage
      this.location = model.location
      this.status = model.status
   }
}

















