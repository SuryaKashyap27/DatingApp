using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixMessageRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Members_MemberId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_Members_MemberId1",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_MemberId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_MemberId1",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "MemberId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "MemberId1",
                table: "Messages");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MemberId",
                table: "Messages",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MemberId1",
                table: "Messages",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Messages_MemberId",
                table: "Messages",
                column: "MemberId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_MemberId1",
                table: "Messages",
                column: "MemberId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Members_MemberId",
                table: "Messages",
                column: "MemberId",
                principalTable: "Members",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_Members_MemberId1",
                table: "Messages",
                column: "MemberId1",
                principalTable: "Members",
                principalColumn: "Id");
        }
    }
}
