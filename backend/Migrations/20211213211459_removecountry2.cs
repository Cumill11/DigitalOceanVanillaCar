using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class removecountry2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClientCountry",
                table: "ClientAddresses");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ClientCountry",
                table: "ClientAddresses",
                type: "text",
                nullable: true);
        }
    }
}
