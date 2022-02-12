using System;
namespace backend.Models
{
    public class Delivery
    {
        public int DeliveryId { get; set; }
        
        public DateTime? DeliveryDateTime { get; set; }
        public string DeliveryCity { get; set; }
        public string DeliveryStreet { get; set; }
        public string DeliveryPostalCode { get; set; }
        public int? CreatedById { get; set; }

    }
}
