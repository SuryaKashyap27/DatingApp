using API.DTO;
using API.Entities;
using API.Interfaces;
namespace API.Extensions
{
    public static class AppUserExtensions
    {
        public static userDTO ToDto(this AppUser user,ITokenService tokenService)
        {
             return new userDTO
            {
                id=user.Id,
                DisplayName=user.DisplayName,
                Email=user.Email,
                Image_URL = user.ImageUrl,
                Token=tokenService.CreateToken(user)
            };


        }
    }
}