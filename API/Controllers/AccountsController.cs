using API.Data;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using API.Entities;
using API.DTO;
using Microsoft.EntityFrameworkCore;
using API.Interfaces;
using API.Extensions;

namespace API.Controllers
{
    public class AccountsController(AppDbContext context,ITokenService tokenService) : BaseApiController
    {
        [HttpPost("register")] // api/account/register

        public async Task< ActionResult<userDTO>> Register(RegisterDTO registerDTO)
        {
            if(await EmailExists(registerDTO.Email)) return BadRequest("Email is already in use");

            using var hmac=new HMACSHA512();
            var user=new AppUser
            {
                DisplayName=registerDTO.DisplayName,
                Email=registerDTO.Email.ToLower(),

                PasswordHash=hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password)),
                PasswordSalt=hmac.Key

            };
            context.Users.Add(user);
            await context.SaveChangesAsync();
             return user.ToDto(tokenService);


        }

    [HttpPost("login")]
    public async Task<ActionResult<userDTO>> Login(LoginDTO login)
        {
            var user=await context.Users.SingleOrDefaultAsync(x=>x.Email==login.Email);
            if (user==null)return Unauthorized("Invalid Email");
            using var hmac=new HMACSHA512(user.PasswordSalt);
            var computedHash=hmac.ComputeHash(Encoding.UTF8.GetBytes(login.Password));
            
            for (var i=0;i<computedHash.Length;i++)
            {
                if(computedHash[i]!=user.PasswordHash[i]) return Unauthorized("Invalid Password");
            }
            var token=tokenService.CreateToken(user);
            // return new userDTO
            // {
            //     id=user.Id,
            //     DisplayName=user.DisplayName,
            //     Email=user.Email,
                
            //     Token=tokenService.CreateToken(user)
            // };
             return user.ToDto(tokenService);


        }

        private async Task<bool> EmailExists(string email)
        {
            return await context.Users.AnyAsync(x => x.Email==email.ToLower());

        }



    }
}