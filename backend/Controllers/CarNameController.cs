using System.Collections.Generic;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarNameController : ControllerBase
    {
        private readonly ICarNameService _carNameService;

        public CarNameController(ICarNameService carNameService)
        {
            _carNameService = carNameService;
        }

        [HttpGet("manufacturer")]
        public ActionResult<List<string>> GetCarManufacturers()
        {
            var carnames = _carNameService.GetCarManufacturers();

            return Ok(carnames);
        }

        [HttpGet("{name}")]
        public ActionResult<IEnumerable<CarName>> GetCarManufacturer([FromRoute] string name)
        {
            var carnamesmodel = _carNameService.GetCarManufacturer(name);

            return Ok(carnamesmodel);
        }
    }
}