// DTO - data transfer object

module.exports = class UserDto {
   email
   id
   name

   constructor(model) {
      this.email = model.email
      this.id = model._id
      this.name = model.name
   }
}
