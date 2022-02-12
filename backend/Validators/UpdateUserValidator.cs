using backend.Dto;
using backend.Models;
using FluentValidation;

namespace backend.Others
{
    public class UpdateUserValidator : AbstractValidator<UpdateUser>
    {
        public UpdateUserValidator(CarRepairDbContext dbcontext)
        {
            RuleFor(u => u.UserEmail).NotEmpty().EmailAddress();
            RuleFor(v => v.UserTelephone)
                .MinimumLength(9)
                .MaximumLength(15)
                .NotEmpty();
        }
    }
}