using API.Data;
using API.Dtos;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using API.Extensions;

namespace API.Controllers;

[Authorize]
public class MembersController(IMemberRepository memberRepository, IPhotoService photoService) : BaseApiController
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
        member.User!.DisplayName = memberUpdate.DisplayName ?? member.User.DisplayName;
        // memberRepository.Update(member);
        if (await memberRepository.SaveAllAsync())
            return NoContent();

        return BadRequest("Failed to update member");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
    {
        var member = await memberRepository.GetMemberForUpdateAsync(
            User.GetMemberId());

        if (member == null)
            return BadRequest("Cannot update member");

        var result = await photoService.UploadPhotoAsync(file);

        if (result.Error != null)
            return BadRequest(result.Error.Message);

        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId,
            MemberId = member.Id
        };

        if (member.ImageUrl == null)
        {
            member.ImageUrl = photo.Url;
            member.User!.ImageUrl = photo.Url;
        }

        member.Photos.Add(photo);

        if (await memberRepository.SaveAllAsync())
            return photo;

        return BadRequest("Problem adding photo");
    }


    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var member = await memberRepository
            .GetMemberForUpdateAsync(User.GetMemberId());

        if (member == null)
            return BadRequest("Cannot get member from token");

        var photo = member.Photos
            .SingleOrDefault(x => x.Id == photoId);

        if (photo == null || member.ImageUrl == photo.Url)
            return BadRequest("Cannot set this as main image");

        member.ImageUrl = photo.Url;
        member.User!.ImageUrl = photo.Url;

        if (await memberRepository.SaveAllAsync())
            return NoContent();

        return BadRequest("Problem setting main photo");
    }

    [HttpDelete("delete-photo/{photoId}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var member = await memberRepository
            .GetMemberForUpdateAsync(User.GetMemberId());

        if (member == null)
            return BadRequest("Cannot get member from token");

        var photo = member.Photos
            .SingleOrDefault(x => x.Id == photoId);

        if (photo == null || photo.Url == member.ImageUrl)
            return BadRequest("This photo cannot be deleted");

        if (photo.PublicId != null)
        {
            var result = await photoService
                .DeletePhotoAsync(photo.PublicId);

            if (result.Error != null)
                return BadRequest(result.Error.Message);
        }

        member.Photos.Remove(photo);

        if (await memberRepository.SaveAllAsync())
            return Ok();

        return BadRequest("Problem deleting the photo");
    }

}