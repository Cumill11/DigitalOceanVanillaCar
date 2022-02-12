using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class addmechanicid : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MechanicId",
                table: "Visits",
                type: "integer",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MechanicId",
                table: "Visits");
        }
    }
}
