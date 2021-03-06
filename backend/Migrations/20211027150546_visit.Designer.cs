// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using backend.Models;

namespace backend.Migrations
{
    [DbContext(typeof(CarRepairDbContext))]
    [Migration("20211027150546_visit")]
    partial class visit
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 63)
                .HasAnnotation("ProductVersion", "5.0.10")
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            modelBuilder.Entity("backend.Models.Car", b =>
                {
                    b.Property<int>("CarId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("CarManufacturer")
                        .HasColumnType("text");

                    b.Property<string>("CarModel")
                        .HasColumnType("text");

                    b.Property<string>("CarPlates")
                        .HasColumnType("text");

                    b.Property<string>("CarProductionYear")
                        .HasColumnType("text");

                    b.Property<string>("CarVin")
                        .IsRequired()
                        .HasMaxLength(17)
                        .HasColumnType("character varying(17)");

                    b.Property<int>("FuelTypeId")
                        .HasColumnType("integer");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("CarId");

                    b.HasIndex("FuelTypeId");

                    b.HasIndex("UserId");

                    b.ToTable("Cars");
                });

            modelBuilder.Entity("backend.Models.ClientAddress", b =>
                {
                    b.Property<int>("ClientAddressId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("ClientCity")
                        .HasColumnType("text");

                    b.Property<string>("ClientCountry")
                        .HasColumnType("text");

                    b.Property<string>("ClientPostalCode")
                        .HasColumnType("text");

                    b.Property<string>("ClientStreet")
                        .HasColumnType("text");

                    b.Property<int?>("CreatedById")
                        .HasColumnType("integer");

                    b.HasKey("ClientAddressId");

                    b.ToTable("ClientAddresses");
                });

            modelBuilder.Entity("backend.Models.Delivery", b =>
                {
                    b.Property<int>("DeliveryId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int?>("CreatedById")
                        .HasColumnType("integer");

                    b.Property<string>("DeliveryCity")
                        .HasColumnType("text");

                    b.Property<string>("DeliveryCountry")
                        .HasColumnType("text");

                    b.Property<string>("DeliveryPostalCode")
                        .HasColumnType("text");

                    b.Property<string>("DeliveryStreet")
                        .HasColumnType("text");

                    b.HasKey("DeliveryId");

                    b.ToTable("Deliveries");
                });

            modelBuilder.Entity("backend.Models.FuelType", b =>
                {
                    b.Property<int>("FuelTypeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("FuelTypeName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("FuelTypeId");

                    b.ToTable("FuelTypes");
                });

            modelBuilder.Entity("backend.Models.MechanicReview", b =>
                {
                    b.Property<int>("MechanicReviewId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int>("MechanicId")
                        .HasColumnType("integer");

                    b.Property<string>("MechanicReviewName")
                        .HasColumnType("text");

                    b.Property<int>("MechanicReviewScoreId")
                        .HasColumnType("integer");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("MechanicReviewId");

                    b.HasIndex("MechanicReviewScoreId");

                    b.HasIndex("UserId");

                    b.ToTable("MechanicReviews");
                });

            modelBuilder.Entity("backend.Models.MechanicReviewScore", b =>
                {
                    b.Property<int>("MechanicReviewScoreId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int>("MechanicReviewScoreName")
                        .HasColumnType("integer");

                    b.HasKey("MechanicReviewScoreId");

                    b.ToTable("MechanicReviewScores");
                });

            modelBuilder.Entity("backend.Models.Payment", b =>
                {
                    b.Property<int>("PaymentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("PaymentCost")
                        .HasColumnType("text");

                    b.Property<int>("PaymentTypeId")
                        .HasColumnType("integer");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("PaymentId");

                    b.HasIndex("PaymentTypeId");

                    b.HasIndex("UserId");

                    b.ToTable("Payments");
                });

            modelBuilder.Entity("backend.Models.PaymentType", b =>
                {
                    b.Property<int>("PaymentTypeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("PaymentTypeName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("PaymentTypeId");

                    b.ToTable("PaymentTypes");
                });

            modelBuilder.Entity("backend.Models.Review", b =>
                {
                    b.Property<int>("ReviewId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int>("MechanicReviewScoreId")
                        .HasColumnType("integer");

                    b.Property<string>("ReviewName")
                        .HasColumnType("text");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("ReviewId");

                    b.HasIndex("MechanicReviewScoreId");

                    b.HasIndex("UserId");

                    b.ToTable("Reviews");
                });

            modelBuilder.Entity("backend.Models.Role", b =>
                {
                    b.Property<int>("RoleId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("RoleId");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("backend.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int?>("ClientAddressId")
                        .HasColumnType("integer");

                    b.Property<int>("RoleId")
                        .HasColumnType("integer");

                    b.Property<string>("UserCode")
                        .HasColumnType("text");

                    b.Property<bool>("UserConfirmRegistration")
                        .HasColumnType("boolean");

                    b.Property<string>("UserDescription")
                        .HasColumnType("text");

                    b.Property<string>("UserEmail")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UserName")
                        .HasColumnType("text");

                    b.Property<string>("UserPassword")
                        .HasColumnType("text");

                    b.Property<string>("UserReview")
                        .HasColumnType("text");

                    b.Property<string>("UserSurname")
                        .HasColumnType("text");

                    b.Property<string>("UserTelephone")
                        .HasColumnType("text");

                    b.HasKey("UserId");

                    b.HasIndex("ClientAddressId");

                    b.HasIndex("RoleId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("backend.Models.Visit", b =>
                {
                    b.Property<int>("VisitId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<int>("DeliveryId")
                        .HasColumnType("integer");

                    b.Property<bool>("IsDelivery")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsDone")
                        .HasColumnType("boolean");

                    b.Property<int>("PaymentId")
                        .HasColumnType("integer");

                    b.Property<int>("UserId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("VisitDateTime")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("VisitLog")
                        .HasColumnType("text");

                    b.Property<int>("VisitTypeId")
                        .HasColumnType("integer");

                    b.HasKey("VisitId");

                    b.HasIndex("DeliveryId");

                    b.HasIndex("PaymentId");

                    b.HasIndex("UserId");

                    b.HasIndex("VisitTypeId");

                    b.ToTable("Visits");
                });

            modelBuilder.Entity("backend.Models.VisitType", b =>
                {
                    b.Property<int>("VisitTypeId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

                    b.Property<string>("VisitTypeName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("VisitTypeId");

                    b.ToTable("VisitTypes");
                });

            modelBuilder.Entity("backend.Models.Car", b =>
                {
                    b.HasOne("backend.Models.FuelType", "FuelType")
                        .WithMany()
                        .HasForeignKey("FuelTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("FuelType");

                    b.Navigation("User");
                });

            modelBuilder.Entity("backend.Models.MechanicReview", b =>
                {
                    b.HasOne("backend.Models.MechanicReviewScore", "MechanicReviewScore")
                        .WithMany()
                        .HasForeignKey("MechanicReviewScoreId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MechanicReviewScore");

                    b.Navigation("User");
                });

            modelBuilder.Entity("backend.Models.Payment", b =>
                {
                    b.HasOne("backend.Models.PaymentType", "PaymentType")
                        .WithMany()
                        .HasForeignKey("PaymentTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PaymentType");

                    b.Navigation("User");
                });

            modelBuilder.Entity("backend.Models.Review", b =>
                {
                    b.HasOne("backend.Models.MechanicReviewScore", "MechanicReviewScore")
                        .WithMany()
                        .HasForeignKey("MechanicReviewScoreId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MechanicReviewScore");

                    b.Navigation("User");
                });

            modelBuilder.Entity("backend.Models.User", b =>
                {
                    b.HasOne("backend.Models.ClientAddress", "ClientAddress")
                        .WithMany()
                        .HasForeignKey("ClientAddressId");

                    b.HasOne("backend.Models.Role", "Role")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ClientAddress");

                    b.Navigation("Role");
                });

            modelBuilder.Entity("backend.Models.Visit", b =>
                {
                    b.HasOne("backend.Models.Delivery", "Delivery")
                        .WithMany()
                        .HasForeignKey("DeliveryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Models.Payment", "Payment")
                        .WithMany()
                        .HasForeignKey("PaymentId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("backend.Models.VisitType", "VisitType")
                        .WithMany()
                        .HasForeignKey("VisitTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Delivery");

                    b.Navigation("Payment");

                    b.Navigation("User");

                    b.Navigation("VisitType");
                });
#pragma warning restore 612, 618
        }
    }
}
