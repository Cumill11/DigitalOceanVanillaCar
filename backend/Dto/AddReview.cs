using backend.Models;

namespace backend.Dto
{
    public class AddReview
    {
        public string ReviewName { get; set; }
        public int MechanicReviewScoreId { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
        public virtual MechanicReviewScore MechanicReviewScore { get; set; }
    }
}