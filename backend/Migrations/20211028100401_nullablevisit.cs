using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class nullablevisit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Visits_Deliveries_DeliveryId",
                table: "Visits");

            migrationBuilder.DropForeignKey(
                name: "FK_Visits_Payments_PaymentId",
                table: "Visits");

            migrationBuilder.AlterColumn<int>(
                name: "PaymentId",
                table: "Visits",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "DeliveryId",
                table: "Visits",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Visits_Deliveries_DeliveryId",
                table: "Visits",
                column: "DeliveryId",
                principalTable: "Deliveries",
                principalColumn: "DeliveryId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Visits_Payments_PaymentId",
                table: "Visits",
                column: "PaymentId",
                principalTable: "Payments",
                principalColumn: "PaymentId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Visits_Deliveries_DeliveryId",
                table: "Visits");

            migrationBuilder.DropForeignKey(
                name: "FK_Visits_Payments_PaymentId",
                table: "Visits");

            migrationBuilder.AlterColumn<int>(
                name: "PaymentId",
                table: "Visits",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DeliveryId",
                table: "Visits",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Visits_Deliveries_DeliveryId",
                table: "Visits",
                column: "DeliveryId",
                principalTable: "Deliveries",
                principalColumn: "DeliveryId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Visits_Payments_PaymentId",
                table: "Visits",
                column: "PaymentId",
                principalTable: "Payments",
                principalColumn: "PaymentId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
