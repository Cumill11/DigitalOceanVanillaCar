namespace backend.Dto
{
    public class AddCar
    {
        public int CarNameId { get; set; }
        public int CarProductionId { get; set; }
        public int FuelTypeId { get; set; }
        public string CarVin { get; set; }
        public string CarPlates { get; set; }

        public string UserEmail { get; set; }
    }
}