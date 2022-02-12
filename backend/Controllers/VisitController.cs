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
    public class VisitController : ControllerBase
    {
        private readonly IVisitService _visitService;


        public VisitController(IVisitService visitService)
        {
            _visitService = visitService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Mechanic, Boss")]
        public ActionResult<IEnumerable<Visit>> GetAllVisits()
        {
            var visits = _visitService.GetAllVisits();
            return Ok(visits);
        }

        [HttpGet("user/{id}")]
        public ActionResult<IEnumerable<Visit>> GetVisitForUser([FromRoute] int id)
        {
            var visits = _visitService.GetVisitForUser(id);
            return Ok(visits);
        }

        [AllowAnonymous]
        [HttpGet("code/{code}")]
        public ActionResult<Visit> GetVisitByCode([FromRoute] string code)
        {
            var visits = _visitService.GetVisitByCode(code);
            return Ok(visits);
        }

        [HttpGet("{id}")]
        public ActionResult<Visit> GetOneVisit([FromRoute] int id)
        {
            var visit = _visitService.GetOneVisit(id);
            return Ok(visit);
        }

        [HttpGet("allvisit/{id}")]
        public ActionResult<IEnumerable<Visit>> GetAllVisitFroMechanic([FromRoute] int id)
        {
            var visits = _visitService.GetAllVisitsForMechanic(id);
            return Ok(visits);
        }

        [HttpGet("notpayed/{id}")]
        public ActionResult<IEnumerable<Visit>> GetAllNotPayedVisitsForUser([FromRoute] int id)
        {
            var NotPayedVisits = _visitService.GetNotPayedVisit(id);
            return Ok(NotPayedVisits);
        }

        [HttpPut("{id}")]
        public ActionResult UpdateVisit([FromRoute] int id, [FromBody] AddVisit updateVisit)
        {
            _visitService.UpdateVisit(id, updateVisit);
            return Ok();
        }

        [HttpPut("addpickup/{id}")]
        public ActionResult AddPickup([FromRoute] int id, [FromBody] AddPickup addPickup)
        {
            _visitService.AddPickup(id, addPickup);
            return Ok();
        }

        [HttpPut("updatepickup/{id}")]
        public ActionResult UpdatePickup([FromRoute] int id, [FromBody] AddPickup updatePickup)
        {
            _visitService.UpdatePickup(id, updatePickup);
            return Ok();
        }

        [HttpPut("updatedelivery/{id}")]
        public ActionResult UpdateDelivery([FromRoute] int id, [FromBody] AddDelivery updateDelivery)
        {
            _visitService.UpdateDelivery(id, updateDelivery);
            return Ok();
        }

        [HttpPut("deliveryadddatetime/{id}")]
        public ActionResult AddDateTime([FromRoute] int id, [FromBody] AddDelivery updateDelivery)
        {
            _visitService.AddDateTime(id, updateDelivery);
            return Ok();
        }

        [HttpPut("adddelivery/{id}")]
        public ActionResult AddDelivery([FromRoute] int id, [FromBody] AddDelivery addDelivery)
        {
            _visitService.AddDelivery(id, addDelivery);
            return Ok();
        }

        [HttpPut("visitpay/{id}")]
        public ActionResult VisitPay([FromRoute] int id)
        {
            _visitService.VisitPay(id);
            return Ok();
        }

        [HttpPut("visitchoosepay/{id}")]
        public ActionResult VisitChoosePay([FromRoute] int id, [FromBody] AddPaymentType addpayment)
        {
            _visitService.VisitChoosePay(id, addpayment);
            return Ok();
        }

        [HttpPut("visitpaymentcostupdate/{id}")]
        public ActionResult VisitPaymentCostUpdate([FromRoute] int id, [FromBody] AddPaymentType addpayment)
        {
            _visitService.VisitPaymentCostUpdate(id, addpayment);
            return Ok();
        }

        [HttpPut("visitpaymentcost/{id}")]
        public ActionResult VisitPaymentCost([FromRoute] int id, [FromBody] AddPaymentType addpayment)
        {
            _visitService.VisitPaymentCost(id, addpayment);
            return Ok();
        }


        [HttpPut("deletepickup/{id}")]
        public ActionResult DeletePickup([FromRoute] int id)
        {
            _visitService.DeletePickup(id);
            return NoContent();
        }

        [HttpPut("deletedelivery/{id}")]
        public ActionResult DeleteDelivery([FromRoute] int id)
        {
            _visitService.DeleteDelivery(id);
            return NoContent();
        }

        [HttpPut("deletedeliverydatetime/{id}")]
        public ActionResult DeleteDeliveryDateTime([FromRoute] int id)
        {
            _visitService.DeleteDeliveryDateTime(id);
            return Ok();
        }

        [HttpPut("isdone/{id}")]
        public ActionResult IsDone([FromRoute] int id)
        {
            _visitService.IsDone(id);
            return Ok();
        }

        [HttpPut("addvisitlog/{id}")]
        public ActionResult VisitLog([FromRoute] int id, [FromBody] AddVisit visitlog)
        {
            _visitService.VisitLog(id, visitlog);
            return Ok();
        }

        [HttpPut("removevisitlog/{id}")]
        public ActionResult RemoveVisitLog([FromRoute] int id)
        {
            _visitService.RemoveVisitLog(id);
            return Ok();
        }

        [HttpPost]
        public ActionResult AddVisit([FromBody] AddVisit addVisit)
        {
            _visitService.AddVisit(addVisit);
            return Ok();
        }

        [HttpPost("newvisitmechanic")]
        public ActionResult AddVisitMechanic([FromBody] AddVisit addVisit)
        {
            _visitService.AddVisitMechanic(addVisit);
            return Ok();
        }

        [HttpDelete("{id}")]
        public ActionResult DeleteVisit([FromRoute] int id)
        {
            _visitService.DeleteVisit(id);
            return NoContent();
        }
    }
}