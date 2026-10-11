using API.Data;
using API.Dtos;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers;

[Authorize]
public class MembersController(IMemberRepository memberRepository)
    : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
    {
        return Ok(await memberRepository.GetMembersAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Member>> GetMember(string id)
    {
        var member = await memberRepository.GetMemberByIdAsync(id);

        if (member == null)
        {
            return NotFound();
        }

        return Ok(member);
    }

    [HttpGet("{id}/photos")]
    public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
    {
        return Ok(await memberRepository.GetPhotosForMemberAsync(id));
    }


    [HttpPut]
    public async Task<ActionResult> UpdateMember(MemberUpdate memberUpdate)
    {
        var memberId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (memberId == null)
            return BadRequest("No ID found in token");

        var member = await memberRepository.GetMemberForUpdateAsync(memberId);

        if (member == null)
            return BadRequest("Could not get member");

        member.DisplayName = memberUpdate.DisplayName ?? member.DisplayName;
        member.Description = memberUpdate.Description ?? member.Description;
        member.City = memberUpdate.City ?? member.City;
        member.Country = memberUpdate.Country ?? member.Country;
        member.User!.DisplayName =    memberUpdate.DisplayName ?? member.User.DisplayName;
        // memberRepository.Update(member);
        if (await memberRepository.SaveAllAsync())
            return NoContent();

        return BadRequest("Failed to update member");
    }

}