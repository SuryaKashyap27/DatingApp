
using System.ComponentModel.DataAnnotations;

namespace API.Entities;

public class Message
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string Content { get; set; } = string.Empty;

    public DateTime? DateRead { get; set; }

    public DateTime MessageSent { get; set; } = DateTime.UtcNow;

    public bool SenderDeleted { get; set; }

    public bool RecipientDeleted { get; set; }

    // Navigation properties
    public string SenderId { get; set; } = string.Empty;
    public Member Sender { get; set; } = null!;

    public string RecipientId { get; set; } = string.Empty;
    public Member Recipient { get; set; } = null!;


    
}
