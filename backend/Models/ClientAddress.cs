namespace backend.Models
{
    public class ClientAddress
    {
        public int ClientAddressId { get; set; }
        public string ClientCity { get; set; }
        public string ClientStreet { get; set; }
        public string ClientPostalCode { get; set; }

        public int? CreatedById { get; set; }
    }
}