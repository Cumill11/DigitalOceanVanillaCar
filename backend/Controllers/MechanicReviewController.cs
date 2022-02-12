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
    public class MechanicReviewController : ControllerBase
    {
        private readonly IMechanicService _mechanicService;


        public MechanicReviewController(IMechanicService mechanicService)
        {
            _mechanicService = mechanicService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Mechanic, Boss")]
        public ActionResult<IEnumerable<MechanicReview>> GetMechanicReviews()
        {
            var mechanicsreviews = _mechanicService.GetMechanicReviews();
            return Ok(mechanicsreviews);
        }

        [HttpGet("mechanic/{id}")]
        public ActionResult<IEnumerable<MechanicReview>> GetUserReviews(int id)
        {
            var mechanicreview = _mechanicService.GetUserReviews(id);
            return Ok(mechanicreview);
        }

        [HttpGet("{id}")]
        public ActionResult<MechanicReview> GetMechanicReview(int id)
        {
            var mechanicreview = _mechanicService.GetMechanicReview(id);
            return Ok(mechanicreview);
        }

        [HttpPut("{id}")]
        public ActionResult PutMechanicReview(int id, AddMechanicReview updateReview)
        {
            _mechanicService.MechanicReviewUpdate(id, updateReview);
            return Ok("Recenzja zaktualizowana");
        }

        [HttpPost]
        public ActionResult<MechanicReview> NewMechanicReview(AddMechanicReview addMechanicReview)
        {
            _mechanicService.NewMechanicReview(addMechanicReview);
            return Ok("Dodano recenzję");
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            _mechanicService.DeleteMechanicReview(id);
            return NoContent();
        }
    }
}