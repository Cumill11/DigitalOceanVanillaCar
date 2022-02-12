using System;

namespace backend.Dto
{
    public class AddDelivery
    {
        public DateTime? DeliveryDateTime { get; set; }
        public string DeliveryCity { get; set; }
        public string DeliveryStreet { get; set; }
        public string DeliveryPostalCode { get; set; }
    }
}