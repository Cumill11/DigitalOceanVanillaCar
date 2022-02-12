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
    public class VisitNotRegisteredController : ControllerBase
    {
        private readonly IVisitNotRegisteredService _visitService;


        public VisitNotRegisteredController(IVisitNotRegisteredService visitService)
        {
            _visitService = visitService;
        }

        [HttpGet]
        [Authorize(Roles = "Mechanic,Boss")]
        public ActionResult<IEnumerable<VisitNotRegistered>> GetAllVisits()
        {
            var visits = _visitService.GetAllVisits();
            return Ok(visits);
        }

        [HttpGet("code/{code}")]
        [AllowAnonymous]
        public ActionResult<VisitNotRegistered> GetVisitByCode(string code)
        {
            var visit = _visitService.GetVisitByCode(code);

            return Ok(visit);
        }

        [HttpGet("allvisit/{id}")]
        [Authorize(Roles = "Mechanic,Boss")]
        public ActionResult<IEnumerable<VisitNotRegistered>> GetVisitForMechanic(int id)
        {
            var visits = _visitService.GetVisitForMechanic(id);

            return Ok(visits);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Mechanic,Boss")]
        public ActionResult PutVisitNotRegistered(int id, AddNotRegisteredVisit addNotRegisteredVisit)
        {
            _visitService.PutVisitNotRegistered(id, addNotRegisteredVisit);
            return Ok();
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult<VisitNotRegistered> PostVisitNotRegistered(AddNotRegisteredVisit addNotRegisteredVisit)
        {
            var newvisit = _visitService.PostVisitNotRegistered(addNotRegisteredVisit);

            return Ok(newvisit);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Mechanic,Boss")]
        public ActionResult DeleteVisitNotRegistered(int id)
        {
            _visitService.DeleteVisitNotRegistered(id);

            return NoContent();
        }

        [HttpPut("isdone/{id}")]
        [Authorize(Roles = "Mechanic,Boss")]
        public ActionResult IsDone(int id)
        {
            _visitService.IsDone(id);
            return Ok();
        }

        [HttpPut("addvisitlog/{id}")]
        [Authorize(Roles = "Mechanic,Boss")]
        public ActionResult VisitLog(int id, AddNotRegisteredVisit addNotRegisteredVisit)
        {
            _visitService.VisitLog(id, addNotRegisteredVisit);
            return Ok();
        }

        [HttpPut("removevisitlog/{id}")]
        [Authorize(Roles = "Mechanic,Boss")]
        public ActionResult RemoveVisitLog(int id)
        {
            _visitService.RemoveVisitLog(id);
            return Ok();
        }

        [HttpPut("visitpaymentcostupdate/{id}")]
        [Authorize(Roles = "Mechanic,Boss")]
        public ActionResult VisitPaymentCostUpdate(int id, AddPaymentType addPayment)
        {
            _visitService.VisitPaymentCostUpdate(id, addPayment);
            return Ok();
        }

        [HttpPut("visitpaymentcost/{id}")]
        [Authorize(Roles = "Mechanic,Boss")]
        public ActionResult VisitPaymentCost(int id, AddPaymentType addPayment)
        {
            _visitService.VisitPaymentCost(id, addPayment);
            return Ok();
        }
    }
}