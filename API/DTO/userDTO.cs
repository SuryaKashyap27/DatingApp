using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class userDTO
    {
        public required string  id {get; set;}
        public required string DisplayName {get; set;}
        public required string Email {get; set;}
        public string? Image_URL {get; set;}
        public required string Token {get; set;}

    }
}