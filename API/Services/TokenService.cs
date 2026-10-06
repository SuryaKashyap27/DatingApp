using API.Entities;
using API.Interfaces;


using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;


namespace API.Services
{
    public class TokenService(IConfiguration config): ITokenService
    {
        public string CreateToken(AppUser user)
        {
            var tokenkey=config["TokenKey"]?? throw new Exception("Token key is missing in configuration");
            if (tokenkey.Length <64)
            {
                throw new Exception("Token key is empty in configuration");
            }
            var key=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenkey));
            var claims= new List<Claim>
            {
              new Claim(ClaimTypes.Email,user.Email),
              new   Claim(ClaimTypes.NameIdentifier,user.Id),
            };
            var creds=new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor=new SecurityTokenDescriptor
            {
                Subject=new ClaimsIdentity(claims),
                Expires=DateTime.UtcNow.AddDays(7),
                SigningCredentials=creds
            };
            var tokenHandler=new JwtSecurityTokenHandler();
            var token=tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}