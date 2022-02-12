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
    public class CarService : ICarService
    {
        private readonly IAuthorizationService _authorizationService;
        private readonly CarRepairDbContext _context;
        private readonly IUserContextService _userContextService;

        public CarService(CarRepairDbContext context, IUserContextService userContextService,
            IAuthorizationService authorizationService)
        {
            _context = context;
            _userContextService = userContextService;
            _authorizationService = authorizationService;
        }

        public IEnumerable<Car> GetAllCars()
        {
            var cars = _context.Cars
                .Include(c => c.User)
                .Include(c => c.CarName)
                .Include(c => c.CarProduction)
                .ToList();
            return cars;
        }

        public IEnumerable<Car> GetCarForUser(int id)
        {
            var car = new List<Car>();
            var cars = _context.Cars
                .Include(c => c.CarName)
                .Include(c => c.CarProduction)
                .ToList();
            var count = cars.Count();
            for (var i = 0; i <= count; i++)
            {
                car.Add(cars.Find(x => x.UserId == id));
                cars.Remove(cars.Find(x => x.UserId == id));
            }

            car.RemoveAll(item => item == null);
            if (car is null) throw new NotFound("Nie znaleziono samochodów");

            return car;
        }

        public void UpdateCar(CarUpdate carUpdate, int id)
        {
            var car = _context.Cars.FirstOrDefault(c => c.CarId == id);
            if (car is null) throw new NotFound("Nie znaleziono samochodu");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, car, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();


            car.CarNameId = carUpdate.CarNameId;
            car.CarProductionId = carUpdate.CarProductionId;
            car.FuelTypeId = carUpdate.FuelTypeId;
            car.CarVin = carUpdate.CarVin.ToUpper();
            car.CarPlates = carUpdate.CarPlates.ToUpper();

            _context.SaveChanges();
        }

        public void NewCar(AddCar addCar)
        {
            var newCar = new Car
            {
                CarNameId = addCar.CarNameId,
                CarProductionId = addCar.CarProductionId,
                FuelTypeId = addCar.FuelTypeId,
                CarVin = addCar.CarVin.ToUpper(),
                CarPlates = addCar.CarPlates.ToUpper(),
                UserId = _userContextService.GetUserId
            };
            _context.Cars.Add(newCar);
            _context.SaveChanges();
        }

        public void NewCarMechanic(CarUpdate addCar)
        {
            var finduser = _context.Users.FirstOrDefault(u => u.UserEmail == addCar.UserEmail);
            var newCar = new Car
            {
                CarNameId = addCar.CarNameId,
                CarProductionId = addCar.CarProductionId,
                FuelTypeId = addCar.FuelTypeId,
                CarVin = addCar.CarVin.ToUpper(),
                CarPlates = addCar.CarPlates.ToUpper(),
                UserId = finduser.UserId
            };
            _context.Cars.Add(newCar);
            _context.SaveChanges();
        }

        public void DeleteCar(int id)
        {
            var car = _context.Cars.FirstOrDefault(u => u.CarId == id);

            if (car is null) throw new NotFound("Nie znaleziono samochodu");

            _context.Cars.Remove(car);
            _context.SaveChanges();
        }
    }
}