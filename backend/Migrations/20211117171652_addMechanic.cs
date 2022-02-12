using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class addMechanic : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Visits_MechanicId",
                table: "Visits",
                column: "MechanicId");

            migrationBuilder.AddForeignKey(
                name: "FK_Visits_Users_MechanicId",
                table: "Visits",
                column: "MechanicId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Visits_Users_MechanicId",
                table: "Visits");

            migrationBuilder.DropIndex(
                name: "IX_Visits_MechanicId",
                table: "Visits");
        }
    }
}
