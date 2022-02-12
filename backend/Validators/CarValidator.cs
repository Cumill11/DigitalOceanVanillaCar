using System.Linq;
using backend.Dto;
using backend.Models;
using FluentValidation;

namespace backend.Others
{
    public class CarValidator : AbstractValidator<AddCar>
    {
        public CarValidator(CarRepairDbContext dbcontext)
        {
            RuleFor(v => v.CarVin)
                .MinimumLength(17);
            RuleFor(v => v.CarVin)
                .MaximumLength(17);
            RuleFor(u => u.CarVin).NotEmpty();
            RuleFor(v => v.CarProductionId).LessThan(101);
            RuleFor(v => v.CarNameId).LessThan(970);
            RuleFor(v => v.FuelTypeId).LessThan(9);
            RuleFor(u => u.CarVin)
                .Custom((value, context) =>
                {
                    var vin = dbcontext.Cars.Any(u => u.CarVin == value);
                    if (vin) context.AddFailure("VIN", "Już dodałeś taki samochód");
                });
            RuleFor(u => u.CarPlates)
                .Custom((value, context) =>
                {
                    var plates = dbcontext.Cars.Any(u => u.CarPlates == value);
                    if (plates) context.AddFailure("Plates", "Już dodałeś taki samochód");
                });
        }
    }
}