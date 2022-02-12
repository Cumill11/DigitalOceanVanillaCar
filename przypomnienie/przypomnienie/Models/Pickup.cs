using System;

namespace backend.Models
{
    public class Pickup
    {
        public int PickupId { get; set; }
        
        public DateTime PickupDateTime { get; set; }
        public string PickupCity { get; set; }
        public string PickupStreet { get; set; }
        public string PickupPostalCode { get; set; }
        public int? CreatedById { get; set; }
    }
}