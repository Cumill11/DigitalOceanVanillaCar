using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace backend.Migrations
{
    public partial class addNotregistered : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VisitNotRegistereds",
                columns: table => new
                {
                    VisitNotRegisteredId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    VisitNotRegisteredDateTime = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    VisitNotRegisteredLog = table.Column<string>(type: "text", nullable: true),
                    IsDone = table.Column<bool>(type: "boolean", nullable: false),
                    VisitNotRegisteredCode = table.Column<string>(type: "text", nullable: true),
                    PaymentId = table.Column<int>(type: "integer", nullable: true),
                    VisitTypeId = table.Column<int>(type: "integer", nullable: false),
                    MechanicId = table.Column<int>(type: "integer", nullable: true),
                    UserId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VisitNotRegistereds", x => x.VisitNotRegisteredId);
                    table.ForeignKey(
                        name: "FK_VisitNotRegistereds_Payments_PaymentId",
                        column: x => x.PaymentId,
                        principalTable: "Payments",
                        principalColumn: "PaymentId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VisitNotRegistereds_Users_MechanicId",
                        column: x => x.MechanicId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VisitNotRegistereds_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VisitNotRegistereds_VisitTypes_VisitTypeId",
                        column: x => x.VisitTypeId,
                        principalTable: "VisitTypes",
                        principalColumn: "VisitTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VisitNotRegistereds_MechanicId",
                table: "VisitNotRegistereds",
                column: "MechanicId");

            migrationBuilder.CreateIndex(
                name: "IX_VisitNotRegistereds_PaymentId",
                table: "VisitNotRegistereds",
                column: "PaymentId");

            migrationBuilder.CreateIndex(
                name: "IX_VisitNotRegistereds_UserId",
                table: "VisitNotRegistereds",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_VisitNotRegistereds_VisitTypeId",
                table: "VisitNotRegistereds",
                column: "VisitTypeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VisitNotRegistereds");
        }
    }
}
