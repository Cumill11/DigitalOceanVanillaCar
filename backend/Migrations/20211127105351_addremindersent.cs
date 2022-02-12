using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class addremindersent : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ReminderSent",
                table: "Visits",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ReminderSent",
                table: "VisitNotRegistereds",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReminderSent",
                table: "Visits");

            migrationBuilder.DropColumn(
                name: "ReminderSent",
                table: "VisitNotRegistereds");
        }
    }
}
