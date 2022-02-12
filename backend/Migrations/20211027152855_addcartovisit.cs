using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class addcartovisit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CarId",
                table: "Visits",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Visits_CarId",
                table: "Visits",
                column: "CarId");

            migrationBuilder.AddForeignKey(
                name: "FK_Visits_Cars_CarId",
                table: "Visits",
                column: "CarId",
                principalTable: "Cars",
                principalColumn: "CarId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Visits_Cars_CarId",
                table: "Visits");

            migrationBuilder.DropIndex(
                name: "IX_Visits_CarId",
                table: "Visits");

            migrationBuilder.DropColumn(
                name: "CarId",
                table: "Visits");
        }
    }
}
