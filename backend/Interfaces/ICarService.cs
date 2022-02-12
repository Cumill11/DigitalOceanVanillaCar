using System.Collections.Generic;
using backend.Dto;
using backend.Models;

namespace backend.Interfaces
{
    public interface ICarService
    {
        IEnumerable<Car> GetAllCars();
        IEnumerable<Car> GetCarForUser(int id);
        void UpdateCar(CarUpdate carUpdate, int id);
        void NewCar(AddCar addCar);
        void NewCarMechanic(CarUpdate addCar);
        void DeleteCar(int id);
    }
}