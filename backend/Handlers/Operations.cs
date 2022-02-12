using Microsoft.AspNetCore.Authorization;

namespace backend.Handlers
{
    public enum CRUD
    {
        Create,
        Read,
        Update,
        Delete,
        GetById
    }

    public class Operations : IAuthorizationRequirement
    {
        public Operations(CRUD crud)
        {
            CRUD = crud;
        }

        public CRUD CRUD { get; }
    }
}