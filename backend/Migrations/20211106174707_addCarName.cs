using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace backend.Migrations
{
    public partial class addCarName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CarManufacturer",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "CarModel",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "CarProductionYear",
                table: "Cars");

            migrationBuilder.AddColumn<int>(
                name: "CarNameId",
                table: "Cars",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CarProductionId",
                table: "Cars",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "CarNames",
                columns: table => new
                {
                    CarNameId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CarNameManufacturer = table.Column<string>(type: "text", nullable: false),
                    CarNameModel = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarNames", x => x.CarNameId);
                });

            migrationBuilder.CreateTable(
                name: "CarProductions",
                columns: table => new
                {
                    CarProductionId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CarProductionYear = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarProductions", x => x.CarProductionId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cars_CarNameId",
                table: "Cars",
                column: "CarNameId");

            migrationBuilder.CreateIndex(
                name: "IX_Cars_CarProductionId",
                table: "Cars",
                column: "CarProductionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Cars_CarNames_CarNameId",
                table: "Cars",
                column: "CarNameId",
                principalTable: "CarNames",
                principalColumn: "CarNameId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Cars_CarProductions_CarProductionId",
                table: "Cars",
                column: "CarProductionId",
                principalTable: "CarProductions",
                principalColumn: "CarProductionId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cars_CarNames_CarNameId",
                table: "Cars");

            migrationBuilder.DropForeignKey(
                name: "FK_Cars_CarProductions_CarProductionId",
                table: "Cars");

            migrationBuilder.DropTable(
                name: "CarNames");

            migrationBuilder.DropTable(
                name: "CarProductions");

            migrationBuilder.DropIndex(
                name: "IX_Cars_CarNameId",
                table: "Cars");

            migrationBuilder.DropIndex(
                name: "IX_Cars_CarProductionId",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "CarNameId",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "CarProductionId",
                table: "Cars");

            migrationBuilder.AddColumn<string>(
                name: "CarManufacturer",
                table: "Cars",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CarModel",
                table: "Cars",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CarProductionYear",
                table: "Cars",
                type: "text",
                nullable: true);
        }
    }
}
