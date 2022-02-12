using System.ComponentModel.DataAnnotations;

namespace backend.Dto
{
    public class UpdateRole
    {
        public int UserId { get; set; }
        [Required] public int RoleId { get; set; }
    }
}