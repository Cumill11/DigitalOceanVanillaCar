using System.Collections.Generic;
using backend.Dto;
using backend.Models;

namespace backend.Interfaces
{
    public interface IReviewService
    {
        IEnumerable<Review> GetReviews();
        IEnumerable<Review> GetReview(int id);
        void UpdateReview(AddReview updateReview, int id);
        void NewReview(AddReview addReview);
        void DeleteReview(int id);
    }
}