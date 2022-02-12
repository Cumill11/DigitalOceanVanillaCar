namespace backend.Dto
{
    public class UpdateUser
    {
        public int UserId { get; set; }
        public string UserEmail { get; set; }
        public string UserPassword { get; set; }
        public string UserName { get; set; }
        public string UserSurname { get; set; }
        public string UserTelephone { get; set; }
        public string UserDescription { get; set; }
    }
}