using System.ComponentModel.DataAnnotations;

namespace API.Entities;

public class MemberLike
{
    [Required]
    public string SourceMemberId { get; set; } = string.Empty;

    public Member SourceMember { get; set; } = null!;

    [Required]
    public string TargetMemberId { get; set; } = string.Empty;

    public Member TargetMember { get; set; } = null!;
}