namespace backend.Dto
{
    public class AddMechanicReview
    {
        public string MechanicReviewName { get; set; }
        public int MechanicReviewScoreId { get; set; }

        public int UserId { get; set; }
        public int MechanicId { get; set; }
    }
}