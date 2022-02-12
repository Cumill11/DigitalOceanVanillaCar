using System.Security.Claims;

namespace backend.Interfaces
{
    public interface IUserContextService
    {
        ClaimsPrincipal User { get; }
        int GetUserId { get; }
    }
}