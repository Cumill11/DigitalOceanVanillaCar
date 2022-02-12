using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace backend.Migrations
{
    public partial class addpickup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeliveryCountry",
                table: "Deliveries");

            migrationBuilder.AddColumn<int>(
                name: "PickupId",
                table: "Visits",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeliveryDateTime",
                table: "Deliveries",
                type: "timestamp without time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "Pickup",
                columns: table => new
                {
                    PickupId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PickupDateTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    PickupCity = table.Column<string>(type: "text", nullable: true),
                    PickupStreet = table.Column<string>(type: "text", nullable: true),
                    PickupPostalCode = table.Column<string>(type: "text", nullable: true),
                    CreatedById = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pickup", x => x.PickupId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Visits_PickupId",
                table: "Visits",
                column: "PickupId");

            migrationBuilder.AddForeignKey(
                name: "FK_Visits_Pickup_PickupId",
                table: "Visits",
                column: "PickupId",
                principalTable: "Pickup",
                principalColumn: "PickupId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Visits_Pickup_PickupId",
                table: "Visits");

            migrationBuilder.DropTable(
                name: "Pickup");

            migrationBuilder.DropIndex(
                name: "IX_Visits_PickupId",
                table: "Visits");

            migrationBuilder.DropColumn(
                name: "PickupId",
                table: "Visits");

            migrationBuilder.DropColumn(
                name: "DeliveryDateTime",
                table: "Deliveries");

            migrationBuilder.AddColumn<string>(
                name: "DeliveryCountry",
                table: "Deliveries",
                type: "text",
                nullable: true);
        }
    }
}
