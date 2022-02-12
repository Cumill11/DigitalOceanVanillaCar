using backend.Dto;
using backend.Models;
using FluentValidation;

namespace backend.Others
{
    public class UpdatePasswordValidator : AbstractValidator<UpdatePassword>
    {
        public UpdatePasswordValidator(CarRepairDbContext dbcontext)
        {
            RuleFor(u => u.UserPassword).MinimumLength(6);
            RuleFor(u => u.UserConfirmPassword).MinimumLength(6);
            RuleFor(u => u.UserConfirmPassword).Equal(p => p.UserPassword).WithErrorCode("ERR1234");
        }
    }
}