using System.Linq;
using backend.Dto;
using backend.Models;
using FluentValidation;

namespace backend.Others
{
    public class RegisterValidator : AbstractValidator<RegisterUser>
    {
        public RegisterValidator(CarRepairDbContext dbcontext)
        {
            RuleFor(u => u.UserPassword).MinimumLength(6);
            RuleFor(u => u.UserConfirmPassword).Equal(p => p.UserPassword);
            RuleFor(u => u.UserEmail).NotEmpty().EmailAddress();
            RuleFor(u => u.UserEmail)
                .Custom((value, context) =>
                {
                    var email = dbcontext.Users.Any(u => u.UserEmail == value);
                    if (email) context.AddFailure("Email", "Już się zarejestrowałeś z tego e-maila!");
                });
        }
    }
}