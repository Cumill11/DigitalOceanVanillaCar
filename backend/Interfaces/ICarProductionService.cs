using System.Collections.Generic;
using backend.Models;

namespace backend.Interfaces
{
    public interface ICarProductionService
    {
        public IEnumerable<CarProduction> GetCarProductions();
        public CarProduction GetCarProduction(int id);
    }
}