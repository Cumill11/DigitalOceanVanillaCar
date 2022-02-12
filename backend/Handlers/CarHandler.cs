using System.Security.Claims;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace backend.Handlers
{
    public class CarHandler : AuthorizationHandler<Operations, Car>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, Operations operations,
            Car car)
        {
            if (operations.CRUD == CRUD.Create) context.Succeed(operations);
            var userId = context.User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier).Value;
            var role = context.User.FindFirst(c => c.Type == ClaimTypes.Role).Value;


            if (car.UserId == int.Parse(userId) || role == "Admin" || role == "Mechanic" || role == "Boss")
                context.Succeed(operations);

            return Task.CompletedTask;
        }
    }
}