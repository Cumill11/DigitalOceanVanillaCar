using System.Security.Claims;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace backend.Handlers
{
    public class ReviewHandler : AuthorizationHandler<Operations, Review>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, Operations operations,
            Review review)
        {
            if (operations.CRUD == CRUD.Create) context.Succeed(operations);
            var userId = context.User.FindFirst(c => c.Type == ClaimTypes.NameIdentifier).Value;
            var role = context.User.FindFirst(c => c.Type == ClaimTypes.Role).Value;


            if (review.UserId == int.Parse(userId) || role == "Admin" || role == "Mechanic" || role == "Boss")
                context.Succeed(operations);

            return Task.CompletedTask;
        }
    }
}