using System.Collections.Generic;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarProductionController : ControllerBase
    {
        private readonly ICarProductionService _carProductionService;

        public CarProductionController(ICarProductionService carProductionService)
        {
            _carProductionService = carProductionService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<CarProduction>> GetCarProductions()
        {
            var years = _carProductionService.GetCarProductions();
            return Ok(years);
        }

        [HttpGet("{id}")]
        public ActionResult<CarProduction> GetCarProduction(int id)
        {
            var carProduction = _carProductionService.GetCarProduction(id);

            return Ok(carProduction);
        }
    }
}