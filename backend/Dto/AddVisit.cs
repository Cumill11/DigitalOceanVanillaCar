using System;

namespace backend.Dto
{
    public class AddVisit
    {
        public DateTime VisitDateTime { get; set; }
        public int VisitTypeId { get; set; }
        public string VisitLog { get; set; }
        public int CarId { get; set; }
        public int UserId { get; set; }

        public int MechanicId { get; set; }
    }
}