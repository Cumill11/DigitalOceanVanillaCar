namespace backend.Models
{
    public class Review
    {
        public int ReviewId { get; set; }
        public string ReviewName { get; set; }
        public int MechanicReviewScoreId { get; set; }
        public int UserId { get; set; }
        
        public virtual User User { get; set; }
        public virtual MechanicReviewScore MechanicReviewScore { get; set; }
    }
}