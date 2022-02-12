using System;
namespace backend.Models
{
    public class Visit
    {
        public int VisitId { get; set; }
        public DateTime VisitDateTime { get; set; }
        public string VisitLog { get; set; }

        public bool IsDelivery { get; set; } = false;
        public bool IsDone { get; set; } = false;
        public bool ReminderSent { get; set; } = false;

        
        public string VisitCode { get; set; }

        
        public int UserId { get; set; }
        public int CarId { get; set; }

        public int? DeliveryId { get; set; }
        public int? PickupId { get; set; }
        public int? PaymentId { get; set; }
        public int VisitTypeId { get; set; }
        
        public int? MechanicId { get; set; }
        

        public virtual User User { get; set; }
        public virtual User Mechanic { get; set; }
        public virtual Car Car { get; set; }

        public virtual Delivery Delivery { get; set; }
        public virtual Pickup Pickup { get; set; }
        public virtual Payment Payment { get; set; }
        public virtual VisitType VisitType { get; set; }
  
    }
}
