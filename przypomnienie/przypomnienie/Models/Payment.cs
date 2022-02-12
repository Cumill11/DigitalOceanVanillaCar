using System;
namespace backend.Models
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public string PaymentCost { get; set; }
        public int? PaymentTypeId { get; set; }
        public bool IsPayed { get; set; }
        public int UserId { get; set; }
        
        public virtual User User { get; set; }
        public virtual PaymentType PaymentType { get; set; }

    }
}
