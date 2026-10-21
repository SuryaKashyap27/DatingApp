using System.ComponentModel.DataAnnotations;

namespace API.Dtos;

public class MessageDto
{
    public string Id { get; set; } = string.Empty;

    public string SenderId { get; set; } = string.Empty;

    public string SenderDisplayName { get; set; } = string.Empty;

    public string? SenderImageUrl { get; set; }

    public string RecipientId { get; set; } = string.Empty;

    public string RecipientDisplayName { get; set; } = string.Empty;

    public string? RecipientImageUrl { get; set; }

    public string Content { get; set; } = string.Empty;

    public DateTime? DateRead { get; set; }

    public DateTime MessageSent { get; set; }
}