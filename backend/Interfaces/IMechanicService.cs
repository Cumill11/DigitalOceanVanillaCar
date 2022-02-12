using System.Collections.Generic;
using backend.Dto;
using backend.Models;

namespace backend.Interfaces
{
    public interface IMechanicService
    {
        IEnumerable<MechanicReview> GetMechanicReviews();
        IEnumerable<MechanicReview> GetUserReviews(int id);
        IEnumerable<MechanicReview> GetMechanicReview(int id);
        void MechanicReviewUpdate(int id, AddMechanicReview updateReview);
        void NewMechanicReview(AddMechanicReview addMechanicReview);
        void DeleteMechanicReview(int id);
    }
}