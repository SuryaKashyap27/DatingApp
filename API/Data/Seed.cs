using API.DTO;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text.Json;
using API.Entities;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(AppDbContext context)
    {
        // 1. Check if users already exist
        if (await context.Users.AnyAsync())
        {
            return;
        }

        // 2. Read JSON file
        var memberData = await File.ReadAllTextAsync("Data/UserSeedData.json");

        // 3. Convert JSON into C# objects
        var users = JsonSerializer.Deserialize<List<SeedUserDto>>(memberData);

        // 4. Check if JSON conversion failed
        if (users == null)
        {
            Console.WriteLine("No members in seed data");
            return;
        }

        foreach (var seedUser in users)
        {
            using var hmac = new HMACSHA512();

            var user = new AppUser
            {
                Id = seedUser.Id,
                Email = seedUser.Email,
                DisplayName = seedUser.DisplayName,
                ImageUrl = seedUser.ImageUrl,
                PasswordHash = hmac.ComputeHash(
                    System.Text.Encoding.UTF8.GetBytes("Pa$$w0rd")
                ),
                PasswordSalt = hmac.Key
            };

            user.Member = new Member
            {
                Id = seedUser.Id,
                DisplayName = seedUser.DisplayName,
                ImageUrl = seedUser.ImageUrl,
                DateOfBirth = seedUser.DateOfBirth,
                Gender = seedUser.Gender,
                Description = seedUser.Description,
                City = seedUser.City,
                Country = seedUser.Country,
                Created = seedUser.Created,
                LastActive = seedUser.LastActive
            };
            user.Member.Photos.Add(new Photo
            {
                Url = seedUser.ImageUrl!,
                MemberId = seedUser.Id
            });

            context.Users.Add(user);
        }
        await context.SaveChangesAsync();
    }
}