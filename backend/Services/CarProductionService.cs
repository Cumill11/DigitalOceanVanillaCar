using System.Collections.Generic;
using System.Linq;
using backend.Interfaces;
using backend.Models;

namespace backend.Services
{
    public class CarProductionService : ICarProductionService
    {
        private readonly CarRepairDbContext _context;

        public CarProductionService(CarRepairDbContext context)
        {
            _context = context;
        }

        public IEnumerable<CarProduction> GetCarProductions()
        {
            var years = _context.CarProductions.ToList();
            return years;
        }

        public CarProduction GetCarProduction(int id)
        {
            var year = _context.CarProductions.FirstOrDefault(c => c.CarProductionId == id);

            return year;
        }
    }
}