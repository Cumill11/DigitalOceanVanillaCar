using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class addVisitCode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "VisitCode",
                table: "Visits",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VisitCode",
                table: "Visits");
        }
    }
}
