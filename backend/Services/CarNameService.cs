using System.Collections.Generic;
using System.Linq;
using backend.Exceptions;
using backend.Interfaces;
using backend.Models;

namespace backend.Services
{
    public class CarNameService : ICarNameService
    {
        private readonly CarRepairDbContext _context;

        public CarNameService(CarRepairDbContext context)
        {
            _context = context;
        }

        public List<string> GetCarManufacturers()
        {
            var cars = _context.CarNames
                .Select(x => x.CarNameManufacturer)
                .Distinct()
                .OrderBy(x => x)
                .AsEnumerable()
                .ToList();
            return cars;
        }

        public IEnumerable<CarName> GetCarManufacturer(string name)
        {
            var car = new List<CarName>();

            var cars = _context.CarNames
                .ToList();
            var count = cars.Count();
            for (var i = 0; i <= count; i++)
            {
                car.Add(cars.Find(x => x.CarNameManufacturer == name));
                cars.Remove(cars.Find(x => x.CarNameManufacturer == name));
            }

            car.RemoveAll(item => item == null);
            if (car is null) throw new NotFound("Nie znaleziono samochodów");

            return car;
        }
    }
}