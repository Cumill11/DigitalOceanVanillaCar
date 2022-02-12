using System;

namespace backend.Dto
{
    public class AddNotRegisteredVisit
    {
        public DateTime VisitNotRegisteredDateTime { get; set; }
        public string UserEmail { get; set; }
        public int UserTelephone { get; set; }
        public string VisitNotRegisteredLog { get; set; }
        public int MechanicId { get; set; }
        public int VisitTypeId { get; set; }
    }
}