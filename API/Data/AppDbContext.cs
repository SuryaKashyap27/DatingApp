
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options)
       : DbContext(options)
    {



        public DbSet<AppUser> Users { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<MemberLike> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<MemberLike>().HasKey(x => new { x.SourceMemberId, x.TargetMemberId });


            modelBuilder.Entity<MemberLike>()
                .HasOne(x => x.SourceMember)
                .WithMany(x => x.LikedMembers)
                .HasForeignKey(x => x.SourceMemberId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MemberLike>()
                .HasOne(x => x.TargetMember)
                .WithMany(x => x.LikedByMembers)
                .HasForeignKey(x => x.TargetMemberId)
                .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<Message>()
                .HasOne(x => x.Recipient)
                .WithMany(x => x.MessagesReceived)
                .HasForeignKey(x => x.RecipientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(x => x.Sender)
                .WithMany(x => x.MessagesSent)
                .HasForeignKey(x => x.SenderId)
                .OnDelete(DeleteBehavior.Restrict);


            var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
                v => v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
            );
            var nullableDateTimeConverter = new ValueConverter<DateTime?, DateTime?>(
    v => v.HasValue ? v.Value.ToUniversalTime() : null,
    v => v.HasValue
        ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc)
        : null
);

            // foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            // {
            //     foreach (var property in entityType.GetProperties())
            //     {
            //         if (property.ClrType == typeof(DateTime))
            //         {
            //             property.SetValueConverter(dateTimeConverter);
            //         }
            //     }
            // }


            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime))
                    {
                        property.SetValueConverter(dateTimeConverter);
                    }
                    else if (property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(nullableDateTimeConverter);
                    }
                }
            }
        }


    }


}