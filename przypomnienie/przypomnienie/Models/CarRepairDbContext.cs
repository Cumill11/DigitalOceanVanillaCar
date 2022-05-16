using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class CarRepairDbContext : DbContext
    {
        private string _connectionString 

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<FuelType> FuelTypes { get; set; }
        public DbSet<Car> Cars { get; set; }
        
        public DbSet<ClientAddress> ClientAddresses { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Visit> Visits { get; set; }
        public DbSet<VisitNotRegistered> VisitNotRegistereds { get; set; }

        public DbSet<VisitType>VisitTypes { get; set; }
        public DbSet<Delivery> Deliveries { get; set; }
        public DbSet<Pickup> Pickup { get; set; }

        public DbSet<PaymentType> PaymentTypes { get; set; }
        public DbSet <MechanicReview> MechanicReviews { get; set; }
        public DbSet <Review> Reviews { get; set; }
        public DbSet <MechanicReviewScore> MechanicReviewScores { get; set; }
        
        public DbSet<CarProduction>CarProductions { get; set; }
        public DbSet<CarName>CarNames { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(u => u.UserEmail)
                .IsRequired();
            modelBuilder.Entity<Role>()
                .Property(u => u.RoleName)
                .IsRequired();
            modelBuilder.Entity<FuelType>()
                .Property(u => u.FuelTypeName)
                .IsRequired();
            modelBuilder.Entity<PaymentType>()
                .Property(u => u.PaymentTypeName)
                .IsRequired();
            modelBuilder.Entity<VisitType>()
                .Property(u => u.VisitTypeName)
                .IsRequired();
            modelBuilder.Entity<CarProduction>()
                .Property(u => u.CarProductionYear)
                .IsRequired();
            modelBuilder.Entity<CarName>()
                .Property(u => u.CarNameManufacturer)
                .IsRequired();
            modelBuilder.Entity<CarName>()
                .Property(u => u.CarNameModel)
                .IsRequired();
            modelBuilder.Entity<MechanicReviewScore>()
                .Property(u => u.MechanicReviewScoreName)
                .IsRequired();
            modelBuilder.Entity<Car>()
                .Property(u => u.CarVin)
                .HasMaxLength(17)
                .IsRequired();
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql(_connectionString);
        }

    }
}