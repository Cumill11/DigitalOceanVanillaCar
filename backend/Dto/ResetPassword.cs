namespace backend.Dto
{
    public class ResetPassword
    {
        public string UserCode { get; set; }
        public string UserEmail { get; set; }
        public string UserPassword { get; set; }
        public string UserConfirmPassword { get; set; }
    }
}