namespace backend.Dto
{
    public class AddAddress
    {
        public int UserId { get; set; }
        public string ClientCity { get; set; }
        public string ClientStreet { get; set; }
        public string ClientPostalCode { get; set; }
        public int? CreatedById { get; set; }
    }
}