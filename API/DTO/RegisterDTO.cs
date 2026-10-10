using System.ComponentModel.DataAnnotations;

namespace API.DTO
{
    public class RegisterDTO
    {
        [Required]
        public  required string DisplayName {get; set;}="";

        [Required]
        [EmailAddress]
        public  required string Email {get; set;}
        [Required]
        [MaxLength(8, ErrorMessage="Password must be minimum 8 characters")]
        public  required string Password {get; set;}
    }
}