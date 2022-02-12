using backend.Dto;
using backend.Models;
using FluentValidation;

namespace backend.Others
{
    public class DeleteUserValidator : AbstractValidator<DeleteUser>
    {
        public DeleteUserValidator(CarRepairDbContext dbcontext)
        {
            RuleFor(u => u.UserPassword).MinimumLength(6);
        }
    }
}