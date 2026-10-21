using System.ComponentModel.DataAnnotations;

namespace API.Dtos;

public class CreateMessageDto
{
    [Required]
    public string RecipientId { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;
}