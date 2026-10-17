using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikesRepository(AppDbContext context) : ILikesRepository
{
    public void AddLike(MemberLike like)
    {
        context.Likes.Add(like);
    }

    public void DeleteLike(MemberLike like)
    {
        context.Likes.Remove(like);
    }

    public async Task<MemberLike?> GetMemberLike(
        string sourceMemberId, string targetMemberId)
    {
        return await context.Likes.FindAsync(sourceMemberId, targetMemberId);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
    {
        return await context.Likes
            .Where(x => x.SourceMemberId == memberId)
            .Select(x => x.TargetMemberId)
            .ToListAsync();
    }

    // public async Task<IReadOnlyList<Member>> GetMemberLikes(
    //     string predicate, string memberId)
    // {
    //     var query = context.Likes.AsQueryable();

    //     switch (predicate.ToLowerInvariant())
    //     {
    //         case "liked":
    //             return await query
    //                 .Where(x => x.SourceMemberId == memberId)
    //                 .Select(x => x.TargetMember)
    //                 .ToListAsync();

    //         case "liked-by":
    //             return await query
    //                 .Where(x => x.TargetMemberId == memberId)
    //                 .Select(x => x.SourceMember)
    //                 .ToListAsync();

    //         case "mutual":
    //             var likeIds = await GetCurrentMemberLikeIds(memberId);

    //             return await query
    //                 .Where(x => x.TargetMemberId == memberId
    //                          && likeIds.Contains(x.SourceMemberId))
    //                 .Select(x => x.SourceMember)
    //                 .ToListAsync();

    //         default:
    //             return Array.Empty<Member>();
    //     }
    // }


    public async Task<PaginatedResult<Member>> GetMemberLikes(LikesParams likesParams)
    {
        var query = context.Likes.AsQueryable();
        IQueryable<Member> result;

        switch (likesParams.Predicate.ToLowerInvariant())
        {
            case "liked":
                result = query
                    .Where(like => like.SourceMemberId == likesParams.UserId)
                    .Select(like => like.TargetMember);
                break;

            case "liked-by":
                result = query
                    .Where(like => like.TargetMemberId == likesParams.UserId)
                    .Select(like => like.SourceMember);
                break;

            case "mutual":
                var likeIds = await GetCurrentMemberLikeIds(likesParams.UserId);

                result = query
                    .Where(like =>
                        like.TargetMemberId == likesParams.UserId &&
                        likeIds.Contains(like.SourceMemberId))
                    .Select(like => like.SourceMember);
                break;

            default:
                result = Enumerable.Empty<Member>().AsQueryable();
                break;
        }

        return await PaginationHelper.CreateAsync( result,likesParams.PageNumber,likesParams.PageSize );
    }

    public async Task<bool> SaveAllChanges()
    {
        return await context.SaveChangesAsync() > 0;
    }
}