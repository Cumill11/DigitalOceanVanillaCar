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
    public class MechanicReviewService : IMechanicService
    {
        private readonly IAuthorizationService _authorizationService;
        private readonly CarRepairDbContext _context;
        private readonly IUserContextService _userContextService;

        public MechanicReviewService(CarRepairDbContext context, IUserContextService userContextService,
            IAuthorizationService authorizationService)
        {
            _context = context;
            _userContextService = userContextService;
            _authorizationService = authorizationService;
        }

        public IEnumerable<MechanicReview> GetMechanicReviews()
        {
            return _context.MechanicReviews.ToList();
        }

        public IEnumerable<MechanicReview> GetUserReviews(int id)
        {
            var review = new List<MechanicReview>();
            var reviews = _context.MechanicReviews
                .Include(c => c.User)
                .ToList();
            var count = reviews.Count();
            for (var i = 0; i <= count; i++)
            {
                review.Add(reviews.Find(x => x.MechanicId == id));
                reviews.Remove(reviews.Find(x => x.MechanicId == id));
            }

            review.RemoveAll(item => item == null);

            return review;
        }

        public IEnumerable<MechanicReview> GetMechanicReview(int id)
        {
            var review = new List<MechanicReview>();
            var reviews = _context.MechanicReviews
                .Include(c => c.User)
                .ToList();
            var count = reviews.Count();
            for (var i = 0; i <= count; i++)
            {
                review.Add(reviews.Find(x => x.UserId == id));
                reviews.Remove(reviews.Find(x => x.UserId == id));
            }

            review.RemoveAll(item => item == null);

            return review;
        }

        public void MechanicReviewUpdate(int id, AddMechanicReview updateReview)
        {
            var review = _context.MechanicReviews.FirstOrDefault(r => r.MechanicReviewId == id);
            if (review is null) throw new NotFound("Nie znaleziono recenzji");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, review, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();

            review.MechanicReviewName = updateReview.MechanicReviewName;
            review.MechanicReviewScoreId = updateReview.MechanicReviewScoreId;
            _context.SaveChanges();
        }

        public void NewMechanicReview(AddMechanicReview addMechanicReview)
        {
            var review = new List<MechanicReview>();
            var reviews = _context.MechanicReviews
                .ToList();
            var count = reviews.Count();
            for (var i = 0; i <= count; i++)
            {
                review.Add(reviews.Find(c =>
                    c.MechanicId == addMechanicReview.MechanicId && c.UserId == _userContextService.GetUserId));
                reviews.Remove(reviews.Find(c =>
                    c.MechanicId == addMechanicReview.MechanicId && c.UserId == _userContextService.GetUserId));
            }


            review.RemoveAll(item => item == null);

            if (review.Count == 0)
            {
                var newReview = new MechanicReview
                {
                    MechanicReviewName = addMechanicReview.MechanicReviewName,
                    MechanicReviewScoreId = addMechanicReview.MechanicReviewScoreId,
                    UserId = _userContextService.GetUserId,
                    MechanicId = addMechanicReview.MechanicId
                };
                _context.MechanicReviews.Add(newReview);
                _context.SaveChanges();
            }
            else
            {
                throw new BadRequest("Juz dodales recenzje");
            }
        }

        public void DeleteMechanicReview(int id)
        {
            var review = _context.MechanicReviews.FirstOrDefault(u => u.MechanicReviewId == id);

            if (review is null) throw new NotFound("Nie znaleziono recenzji");

            _context.MechanicReviews.Remove(review);
            _context.SaveChanges();
        }
    }
}