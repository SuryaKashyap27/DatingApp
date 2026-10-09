using System.Text.Json.Serialization;

namespace API.Entities;

public class Photo
{
    public int Id { get; set; }

    public required string Url { get; set; }

    public string? PublicId { get; set; }

    // Foreign key
    public required string MemberId { get; set; }

    // Navigation property
    [JsonIgnore]
    public Member Member { get; set; } = null!;
}