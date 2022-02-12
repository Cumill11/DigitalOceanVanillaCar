namespace backend.Models
{
    public class MechanicReview
    {
        public int MechanicReviewId { get; set; }
        public string MechanicReviewName { get; set; }
        public int MechanicReviewScoreId { get; set; }
        
        public int UserId { get; set; }
        public int MechanicId { get; set; }
        
        public virtual User User { get; set; }
        public virtual MechanicReviewScore MechanicReviewScore { get; set; }
    }
}