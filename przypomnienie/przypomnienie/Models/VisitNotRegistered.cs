using System;

namespace backend.Models
{
    public class VisitNotRegistered
    {
        public int VisitNotRegisteredId { get; set; }
        public DateTime VisitNotRegisteredDateTime { get; set; }
        public string UserEmail { get; set; }
        public int UserTelephone { get; set; }
        public string VisitNotRegisteredLog { get; set; }
        public bool IsDone { get; set; } = false;
        public bool ReminderSent { get; set; } = false;

        public string VisitNotRegisteredCode { get; set; }
        public int? PaymentId { get; set; }
        public int VisitTypeId { get; set; }
        public int? MechanicId { get; set; }
        public virtual User Mechanic { get; set; }
        public virtual Payment Payment { get; set; }
        public virtual VisitType VisitType { get; set; }
    }
}