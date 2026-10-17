using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class LikesController(ILikesRepository likesRepository) : BaseApiController
{
    [HttpPost("{targetMemberId}")]
    public async Task<ActionResult> ToggleLike(string targetMemberId)
    {
        var sourceMemberId = User.GetMemberId();

        if (sourceMemberId == targetMemberId)
            return BadRequest("You cannot like yourself.");

        var existingLike = await likesRepository.GetMemberLike(
            sourceMemberId, targetMemberId);

        if (existingLike == null)
        {
            likesRepository.AddLike(new API.Entities.MemberLike
            {
                SourceMemberId = sourceMemberId,
                TargetMemberId = targetMemberId
            });
        }
        else
        {
            likesRepository.DeleteLike(existingLike);
        }

        if (await likesRepository.SaveAllChanges())
            return Ok();

        return BadRequest("Failed to update like.");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberLikeIds()
    {
        var memberId = User.GetMemberId();

        var likes = await likesRepository.GetCurrentMemberLikeIds(memberId);

        return Ok(likes);
    }

    // [HttpGet]
    // public async Task<ActionResult<IReadOnlyList<API.Entities.Member>>> GetMemberLikes(
    //     [FromQuery] string predicate)
    // {
    //     var memberId = User.GetMemberId();

    //     var members = await likesRepository.GetMemberLikes(predicate, memberId);

    //     return Ok(members);
    // }
    
[HttpGet]
public async Task<ActionResult<PaginatedResult<Member>>> GetMemberLikes(
    [FromQuery] LikesParams likesParams)
{
    likesParams.UserId = User.GetMemberId();

    var members = await likesRepository.GetMemberLikes(likesParams);

    return Ok(members);
}

}