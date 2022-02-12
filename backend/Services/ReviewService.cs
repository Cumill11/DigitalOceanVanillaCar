using System.Collections.Generic;
using System.Linq;
using backend.Dto;
using backend.Exceptions;
using backend.Handlers;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IAuthorizationService _authorizationService;
        private readonly CarRepairDbContext _context;
        private readonly IUserContextService _userContextService;

        public ReviewService(CarRepairDbContext context, IUserContextService userContextService,
            IAuthorizationService authorizationService)
        {
            _context = context;
            _userContextService = userContextService;
            _authorizationService = authorizationService;
        }

        public IEnumerable<Review> GetReviews()
        {
            return _context.Reviews
                .Include(c => c.User)
                .ToList();
        }

        public IEnumerable<Review> GetReview(int id)
        {
            var review = new List<Review>();
            var reviews = _context.Reviews
                .ToList();
            var count = reviews.Count();
            for (var i = 0; i <= count; i++)
            {
                review.Add(reviews.Find(x => x.UserId == id));
                reviews.Remove(reviews.Find(x => x.UserId == id));
            }

            review.RemoveAll(item => item == null);
            if (reviews is null) throw new NotFound("Nie znaleziono recenzji");

            return review;
        }

        public void UpdateReview(AddReview updateReview, int id)
        {
            var review = _context.Reviews.FirstOrDefault(r => r.ReviewId == id);
            if (review is null) throw new NotFound("Nie znaleziono recenzji");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, review, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();

            review.ReviewName = updateReview.ReviewName;
            review.MechanicReviewScoreId = updateReview.MechanicReviewScoreId;
            _context.SaveChanges();
        }

        public void NewReview(AddReview addReview)
        {
            var review = new List<Review>();
            var reviews = _context.Reviews
                .ToList();
            var count = reviews.Count();
            for (var i = 0; i <= count; i++)
            {
                review.Add(reviews.Find(x => x.UserId == _userContextService.GetUserId));
                reviews.Remove(reviews.Find(x => x.UserId == _userContextService.GetUserId));
            }

            review.RemoveAll(item => item == null);

            if (review.Count == 0)
            {
                var newReview = new Review
                {
                    ReviewName = addReview.ReviewName,
                    MechanicReviewScoreId = addReview.MechanicReviewScoreId,
                    UserId = _userContextService.GetUserId
                };
                _context.Reviews.Add(newReview);
                _context.SaveChanges();
            }
            else
            {
                throw new BadRequest("Juz dodales recenzje");
            }
        }

        public void DeleteReview(int id)
        {
            var review = _context.Reviews.FirstOrDefault(u => u.ReviewId == id);

            if (review is null) throw new NotFound("Nie znaleziono recenzji");

            _context.Reviews.Remove(review);
            _context.SaveChanges();
        }
    }
}