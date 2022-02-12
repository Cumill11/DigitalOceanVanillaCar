using System.Collections.Generic;
using backend.Dto;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Mechanic, User, Boss")]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Mechanic, Boss")]
        public ActionResult<IEnumerable<Review>> GetReviews()
        {
            var reviews = _reviewService.GetReviews();
            return Ok(reviews);
        }

        [HttpGet("{id}")]
        public ActionResult<IEnumerable<Review>> GetReview(int id)
        {
            var review = _reviewService.GetReview(id);
            return Ok(review);
        }

        [HttpPut("{id}")]
        public ActionResult UpdateReview([FromBody] AddReview updateReview, [FromRoute] int id)
        {
            _reviewService.UpdateReview(updateReview, id);
            return Ok("Recenzja zedytowana");
        }

        [HttpPost]
        public ActionResult<Review> NewReview(AddReview addReview)
        {
            _reviewService.NewReview(addReview);
            return Ok("Dodano recenzję");
        }


        [HttpDelete("{id}")]
        public ActionResult DeleteReview(int id)
        {
            _reviewService.DeleteReview(id);
            return NoContent();
        }
    }
}