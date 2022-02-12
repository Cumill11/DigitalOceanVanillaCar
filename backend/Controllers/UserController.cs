using System.Collections.Generic;
using backend.Dto;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/Users")]
    [ApiController]
    [Authorize(Roles = "Admin,Mechanic, User, Boss")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public ActionResult RegisterUser([FromBody] RegisterUser register)
        {
            _userService.RegisterUser(register);
            return Ok();
        }

        [HttpPost("confirm/{email}/{code}")]
        [AllowAnonymous]
        public ActionResult ConfirmFromMail([FromRoute] string email, string code)
        {
            _userService.ConfirmRegistrationFromMail(email, code);
            return Ok();
        }

        [HttpPost("reset")]
        [AllowAnonymous]
        public ActionResult Reset([FromBody] ResetPassword resetPassword)
        {
            _userService.SendResetMail(resetPassword);

            return Ok();
        }

        [HttpPost("resetconfirm")]
        [AllowAnonymous]
        public ActionResult ResetConfirm([FromBody] ResetPassword resetPassword)
        {
            _userService.ResetPassword(resetPassword);

            return Ok();
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public ActionResult Login([FromBody] LoginUser login)
        {
            var token = _userService.JWT(login);
            var user = _userService.GetById(login);

            return Ok(new
            {
                accessToken = token,
                email = login.UserEmail,
                id = user.UserId,
                roleid = user.RoleId
            });
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Mechanic, Boss")]
        public ActionResult<IEnumerable<User>> GetAll()
        {
            var users = _userService.GetAll();
            return Ok(users);
        }

        [HttpGet("mechanic")]
        [AllowAnonymous]
        public ActionResult<User> GetMechanics()
        {
            var mechanics = _userService.GetMechanics();
            return Ok(mechanics);
        }

        [HttpGet("mechanic/{id}")]
        [AllowAnonymous]
        public ActionResult<User> GetMechanicById([FromRoute] int id)
        {
            var mechanic = _userService.GetMechanicById(id);
            return Ok(mechanic);
        }

        [HttpGet("{id}")]
        public ActionResult<User> GetById([FromRoute] int id)
        {
            var users = _userService.GetOne(id);
            return Ok(users);
        }

        [HttpDelete]
        [AllowAnonymous]
        public ActionResult Delete([FromBody] DeleteUser deleteUser)
        {
            _userService.Delete(deleteUser);

            return NoContent();
        }

        [HttpDelete("delete/{id}")]
        [AllowAnonymous]
        public ActionResult Delete([FromRoute] int id)
        {
            _userService.DeleteAdmin(id);

            return NoContent();
        }

        [HttpPut("updaterole")]
        [Authorize(Roles = "Admin")]
        public ActionResult UpdateRole([FromBody] UpdateRole update)
        {
            _userService.UpdateRole(update);
            return Ok("Zmieniono rolę");
        }

        [HttpPut("updatepassword")]
        public ActionResult UpdatePassword([FromBody] UpdatePassword passwordupdate)
        {
            _userService.UpdatePassword(passwordupdate);
            return Ok("Zmieniono hasło");
        }

        [HttpPut("updateuser")]
        public ActionResult UpdateUser([FromBody] UpdateUser userupdate)
        {
            _userService.UpdateUser(userupdate);
            return Ok("Zmieniono dane");
        }

        //Address

        [HttpPut("addaddress")]
        public ActionResult AddAddress([FromBody] AddAddress addAddress)
        {
            _userService.AddAddress(addAddress);
            return Ok("Dodano adres");
        }
        [HttpPut("updateaddress")]
        public ActionResult UpdateAddress([FromBody] AddAddress addAddress)
        {
            _userService.UpdateAddress(addAddress);
            return Ok("Zaktualizowany adres");
        }
    }
}