using System;

namespace backend.Dto
{
    public class RegisterUser
    {
        public string UserEmail { get; set; }
        public string UserPassword { get; set; }
        public string UserConfirmPassword { get; set; }
        public string UserName { get; set; }
        public string UserSurname { get; set; }
        public int RoleId { get; set; } = 1;
    }
}