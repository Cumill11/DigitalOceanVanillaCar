namespace backend.Dto
{
    public class UpdatePassword
    {
        public int UserId { get; set; }
        public string UserOldPassword { get; set; }
        public string UserPassword { get; set; }
        public string UserConfirmPassword { get; set; }
    }
}