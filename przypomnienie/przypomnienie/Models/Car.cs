using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Car
    {
        public int CarId { get; set; }
        // public string CarManufacturer { get; set; }
        // public string CarModel { get; set; }
        // public string CarProductionYear { get; set; }
        
        public int CarNameId { get; set; }
        public int CarProductionId { get; set; }
        public string CarVin { get; set; }
        
        public string CarPlates { get; set; }
        
        public int FuelTypeId { get; set; }

        public int UserId { get; set; }
        
        public virtual User User { get; set; }
        public virtual FuelType FuelType { get; set; }
        public virtual CarProduction CarProduction { get; set; }
        public virtual CarName CarName { get; set; }

        
    }
}
