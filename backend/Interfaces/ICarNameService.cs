using System.Collections.Generic;
using backend.Models;

namespace backend.Interfaces
{
    public interface ICarNameService
    {
        public List<string> GetCarManufacturers();
        public IEnumerable<CarName> GetCarManufacturer(string name);
    }
}