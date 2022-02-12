using backend.Dto;
using backend.Models;
using FluentValidation;

namespace backend.Others
{
    public class ResetPasswordValidator : AbstractValidator<ResetPassword>
    {
        public ResetPasswordValidator(CarRepairDbContext dbcontext)
        {
            RuleFor(u => u.UserPassword).MinimumLength(6);
            RuleFor(u => u.UserConfirmPassword).MinimumLength(6);
            RuleFor(u => u.UserConfirmPassword).Equal(p => p.UserPassword);
            RuleFor(u => u.UserEmail).NotEmpty().EmailAddress();
        }
    }
}