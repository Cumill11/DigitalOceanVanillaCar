using System;

namespace backend.Dto
{
    public class AddPickup
    {
        public DateTime PickupDateTime { get; set; }
        public string PickupCity { get; set; }
        public string PickupStreet { get; set; }
        public string PickupPostalCode { get; set; }
        public int? CreatedById { get; set; }
    }
}