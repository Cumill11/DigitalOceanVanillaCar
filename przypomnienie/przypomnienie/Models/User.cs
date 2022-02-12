using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string UserEmail { get; set; }
        public string UserName { get; set; }
        public string UserSurname { get; set; }
      [JsonIgnore]
        public string UserPassword { get; set; }  
        public string UserTelephone { get; set; }
        public string UserDescription { get; set; }
        public string UserReview { get; set; }
        public string UserCode { get; set; }
        public bool UserConfirmRegistration { get; set; }
        public DateTime UserRegisterTime { get; set; }

        public int RoleId { get; set; }
        public int? ClientAddressId { get; set; }

        public virtual Role Role { get; set; }
        public virtual ClientAddress ClientAddress { get; set; }

    }
}