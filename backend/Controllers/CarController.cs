using System.Collections.Generic;
using backend.Dto;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/Car")]
    [ApiController]
    [Authorize(Roles = "Admin,Mechanic, User, Boss")]
    public class CarController : ControllerBase
    {
        private readonly ICarService _carService;

        public CarController(ICarService carService)
        {
            _carService = carService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Car>> GetAll()
        {
            var cars = _carService.GetAllCars();
            return Ok(cars);
        }


        [HttpGet("{id}")]
        public ActionResult<IEnumerable<Car>> GetCar(int id)
        {
            var car = _carService.GetCarForUser(id);
            return Ok(car);
        }


        [HttpPut("{id}")]
        public ActionResult UpdateCar([FromBody] CarUpdate carUpdate, [FromRoute] int id)
        {
            _carService.UpdateCar(carUpdate, id);
            return Ok("Samochód zedytowany");
        }


        [HttpPost]
        public ActionResult NewCar([FromBody] AddCar addCar)
        {
            _carService.NewCar(addCar);
            return Ok("Dodano samochód");
        }


        [HttpPost("newcarmechanic")]
        [Authorize(Roles = "Admin,Mechanic, Boss")]
        public ActionResult NewCarMechanic([FromBody] CarUpdate addCar)
        {
            _carService.NewCarMechanic(addCar);
            return Ok("Dodano samochód");
        }


        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            _carService.DeleteCar(id);
            return NoContent();
        }
    }
}