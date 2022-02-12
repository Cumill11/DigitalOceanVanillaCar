using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class visit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Visits_DeliveryId",
                table: "Visits");

            migrationBuilder.CreateIndex(
                name: "IX_Visits_DeliveryId",
                table: "Visits",
                column: "DeliveryId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Visits_DeliveryId",
                table: "Visits");

            migrationBuilder.CreateIndex(
                name: "IX_Visits_DeliveryId",
                table: "Visits",
                column: "DeliveryId",
                unique: true);
        }
    }
}
