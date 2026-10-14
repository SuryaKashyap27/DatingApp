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

         [Required]
        public required string Gender { get; set; } = "";

        [Required]
        public required string City { get; set; } = "";

        [Required]
        public required string Country { get; set; } = "";

        [Required]
        public DateOnly DateOfBirth { get; set; }
    }
}