using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class addNotregistered1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VisitNotRegistereds_Users_UserId",
                table: "VisitNotRegistereds");

            migrationBuilder.DropIndex(
                name: "IX_VisitNotRegistereds_UserId",
                table: "VisitNotRegistereds");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "VisitNotRegistereds");

            migrationBuilder.AddColumn<string>(
                name: "UserEmail",
                table: "VisitNotRegistereds",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserTelephone",
                table: "VisitNotRegistereds",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserEmail",
                table: "VisitNotRegistereds");

            migrationBuilder.DropColumn(
                name: "UserTelephone",
                table: "VisitNotRegistereds");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "VisitNotRegistereds",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_VisitNotRegistereds_UserId",
                table: "VisitNotRegistereds",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_VisitNotRegistereds_Users_UserId",
                table: "VisitNotRegistereds",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
