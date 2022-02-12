using backend.Dto;
using backend.Models;
using FluentValidation;

namespace backend.Others
{
    public class LoginValidator : AbstractValidator<LoginUser>
    {
        public LoginValidator(CarRepairDbContext dbcontext)
        {
            RuleFor(u => u.UserPassword).MinimumLength(6);
            RuleFor(u => u.UserEmail).NotEmpty().EmailAddress();
        }
    }
}