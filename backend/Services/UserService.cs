using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using backend.Dto;
using backend.Exceptions;
using backend.Handlers;
using backend.Interfaces;
using backend.Models;
using backend.Others;
using FluentEmail.Core;
using FluentEmail.Razor;
using FluentEmail.Smtp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        private static readonly Random random = new();
        private readonly Authentication _authentication;
        private readonly IAuthorizationService _authorizationService;
        private readonly CarRepairDbContext _context;
        private readonly EmailCredentials _email;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IUserContextService _userContextService;

        private readonly string randomstring = new(Enumerable.Repeat(chars, 8)
            .Select(s => s[random.Next(s.Length)]).ToArray());

        public UserService(CarRepairDbContext context, IPasswordHasher<User> passwordHasher,
            Authentication authentication, IUserContextService userContextService,
            IAuthorizationService authorizationService, EmailCredentials email)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _authentication = authentication;
            _userContextService = userContextService;
            _authorizationService = authorizationService;
            _email = email;
        }


        public void RegisterUser(RegisterUser register)
        {
            var credentials = (_email.UserName, _email.Password, _email.Server, _email.Port);


            var newUser = new User
            {
                UserEmail = register.UserEmail,
                UserName = register.UserName,
                UserSurname = register.UserSurname,
                RoleId = register.RoleId,
                UserCode = randomstring,
                UserConfirmRegistration = false,
                UserRegisterTime= DateTime.Now
            };

            var hashedPassword = _passwordHasher.HashPassword(newUser, register.UserPassword);
            newUser.UserPassword = hashedPassword;
            _context.Users.Add(newUser);
            _context.SaveChanges();
            var sender = new SmtpSender(() => new SmtpClient(credentials.Server)
            {
                UseDefaultCredentials = false,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Port = credentials.Port,
                Credentials = new NetworkCredential(credentials.UserName, credentials.Password),
                EnableSsl = true
            });

            StringBuilder template = new();
            template.AppendLine("Witaj, @Model.FirstName,");
            template.AppendLine("<br>");
            //template.AppendLine("Kliknij <a href='http://localhost:3000/emailconfirm?email=@Model.Email&code=@Model.RandomString'>tutaj</a> aby potwierdzić konto");
            template.AppendLine(
                "Kliknij <html><a href='https://do.vanillacar.me/emailconfirm?email=@Model.Email&code=@Model.RandomString'>tutaj</a></html> aby potwierdzić konto");
            template.AppendLine("<br>");
            template.AppendLine("lub wpisz ten kod: @Model.RandomString, na stronie logowania");
            template.AppendLine("<br>");
            template.AppendLine("- Vanilla Car");

            Email.DefaultSender = sender;
            Email.DefaultRenderer = new RazorRenderer();

            var email = Email
                .From("no-reply@vanillacar.me", "VanillaCar")
                .To(register.UserEmail, register.UserName)
                .Subject("Witaj na naszej witrynie")
                .UsingTemplate(template.ToString(),
                    new {FirstName = register.UserName, Email = register.UserEmail, RandomString = randomstring})
                .Send();
        }

        public User GetById(LoginUser login)
        {
            var user = _context
                .Users
                .FirstOrDefault(r => r.UserEmail == login.UserEmail);
            if (user is null)
                throw new NotFound("Nie znaleziono uzytkownika");

            if (user.UserConfirmRegistration == false)
                throw new BadRequest("Konto nie potwierdzone, kliknij w link z maila");

            user.UserCode = null;
            _context.SaveChanges();
            return user;
        }

        public User GetMechanicById(int id)
        {
            var user = _context
                .Users
                .FirstOrDefault(r => r.UserId == id);
            if (user.RoleId != 2) throw new NotFound("Nie ma takiego mechanika");
            if (user is null)
                throw new NotFound("Nie znaleziono uzytkownika");

            return user;
        }

        public string JWT(LoginUser login)
        {
            var user = _context.Users
                .Include(u => u.Role)
                .FirstOrDefault(u => u.UserEmail == login.UserEmail);

            if (user is null) throw new BadRequest("Nieprawidłowa nazwa lub hasło");
            var result = _passwordHasher.VerifyHashedPassword(user, user.UserPassword, login.UserPassword);

            if (result == PasswordVerificationResult.Failed) throw new BadRequest("Nieprawidłowa nazwa lub hasło");

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new(ClaimTypes.Name, $"{user.UserName} {user.UserSurname}"),
                new(ClaimTypes.Role, $"{user.Role.RoleName}")
            };


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authentication.JwtKey));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddHours(6);


            var token = new JwtSecurityToken(_authentication.JwtIssuer,
                _authentication.JwtIssuer,
                claims,
                expires: expires,
                signingCredentials: cred);

            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(token);
        }

        public IEnumerable<User> GetAll()
        {
            var users = _context.Users.ToList();


            return users;
        }

        public IEnumerable<User> GetMechanics()
        {
            var mechanic = new List<User>();
            var users = _context.Users.ToList();
            for (var i = 0; i < users.Count + 2; i++)
            {
                mechanic.Add(users.Find(x => x.RoleId == 2));
                users.Remove(users.Find(x => x.RoleId == 2));
            }

            mechanic.RemoveAll(item => item == null);


            return mechanic;
        }

        public User GetOne(int id)
        {
            var user = _context.Users
                .Include(u => u.ClientAddress)
                .FirstOrDefault(u => u.UserId == id);


            if (user is null) throw new NotFound("Nie znaleziono użytkownika");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, user, new Operations(CRUD.GetById)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();


            return user;
        }

        public void Delete(DeleteUser deleteUser)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == deleteUser.UserId);

            if (user is null) throw new NotFound("Nie znaleziono użytkownika");
            var result = _passwordHasher.VerifyHashedPassword(user, user.UserPassword, deleteUser.UserPassword);

            if (result == PasswordVerificationResult.Failed) throw new BadRequest("Nieprawidłowe hasło");

            _context.Users.Remove(user);
            _context.SaveChanges();
        }

        public void DeleteAdmin(int id)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == id);

            if (user is null) throw new NotFound("Nie znaleziono użytkownika");

            _context.Users.Remove(user);
            _context.SaveChanges();
        }

        public void UpdateRole(UpdateRole update)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == update.UserId);
            if (user is null) throw new NotFound("Nie znaleziono użytkownika");

            user.RoleId = update.RoleId;
            _context.SaveChanges();
        }

        public void UpdatePassword(UpdatePassword passwordupdate)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == passwordupdate.UserId);
            if (user is null) throw new NotFound("Nie znaleziono użytkownika");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, user, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();
            var result = _passwordHasher.VerifyHashedPassword(user, user.UserPassword, passwordupdate.UserOldPassword);

            if (result == PasswordVerificationResult.Failed) throw new BadRequest("Nieprawidłowe stare hasło");
            var hashedPassword = _passwordHasher.HashPassword(user, passwordupdate.UserPassword);
            user.UserPassword = hashedPassword;

            _context.SaveChanges();
        }

        public void UpdateUser(UpdateUser userupdate)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserId == userupdate.UserId);
            if (user is null) throw new NotFound("Nie znaleziono użytkownika");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, user, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();
            var result = _passwordHasher.VerifyHashedPassword(user, user.UserPassword, userupdate.UserPassword);

            if (result == PasswordVerificationResult.Failed) throw new BadRequest("Nieprawidłowe hasło");


            user.UserEmail = userupdate.UserEmail;
            user.UserName = userupdate.UserName;
            user.UserSurname = userupdate.UserSurname;
            user.UserTelephone = userupdate.UserTelephone;
            user.UserDescription = userupdate.UserDescription;
            _context.SaveChanges();
        }

        public void ConfirmRegistrationFromMail(string email, string code)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserEmail == email);
            if (user is null) throw new NotFound("Nie znaleziono użytkownika");

            if (user.UserConfirmRegistration) throw new BadRequest("Już potwierdziłeś konto");

            if (user.UserCode == code && user.UserEmail == email)
            {
                user.UserConfirmRegistration = true;
                _context.SaveChanges();
            }
            else
            {
                throw new NotFound("Zły kod");
            }
        }

        public void SendResetMail(ResetPassword resetPassword)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserEmail == resetPassword.UserEmail);
            if (user is null) throw new NotFound("Nie znaleziono użytkownika");
            user.UserCode = randomstring;
            _context.SaveChanges();

            var credentials = (_email.UserName, _email.Password, _email.Server, _email.Port);


            var sender = new SmtpSender(() => new SmtpClient(credentials.Server)
            {
                UseDefaultCredentials = false,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Port = credentials.Port,
                Credentials = new NetworkCredential(credentials.UserName, credentials.Password),
                EnableSsl = true
            });

            StringBuilder template = new();
            template.AppendLine("Witaj, @Model.FirstName,");
            template.AppendLine("<br>");
            //template.AppendLine("Aby zresetować hasło, kliknij <a href='http://localhost:3000/recoverconfirm'>tutaj</a> i wpisz podany kod z maila");
            template.AppendLine(
                "Aby zresetować hasło, kliknij <html><a href='https://do.vanillacar.me/recoverconfirm'>tutaj</a></html> i wpisz podany kod z maila");
            template.AppendLine("<br>");
            template.AppendLine("Twój kod: @Model.RandomString");
            template.AppendLine("<br>");
            template.AppendLine("- Vanilla Car");

            Email.DefaultSender = sender;
            Email.DefaultRenderer = new RazorRenderer();

            var email = Email
                .From("no-reply@vanillacar.me", "VanillaCar")
                .To(user.UserEmail, user.UserName)
                .Subject("Reset hasła")
                .UsingTemplate(template.ToString(),
                    new {FirstName = user.UserName, Email = user.UserEmail, RandomString = randomstring})
                .Send();
        }

        public void ResetPassword(ResetPassword resetPassword)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserEmail == resetPassword.UserEmail);
            if (user is null) throw new NotFound("Nie znaleziono użytkownika");

            if (user.UserCode == resetPassword.UserCode && user.UserEmail == resetPassword.UserEmail)
            {
                var hashedPassword = _passwordHasher.HashPassword(user, resetPassword.UserPassword);
                user.UserPassword = hashedPassword;
                user.UserCode = null;
                _context.SaveChanges();
            }
            else
            {
                throw new BadRequest("Zły kod");
            }
        }

        public void AddAddress(AddAddress addAddress)
        {
            var user = _context.Users
                .Include(u => u.ClientAddress)
                .FirstOrDefault(u => u.UserId == addAddress.UserId);
            if (user is null) throw new NotFound("Nie znaleziono użytkownika");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, user, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();

            user.ClientAddress = new ClientAddress
            {
                ClientCity = addAddress.ClientCity,
                ClientStreet = addAddress.ClientStreet,
                ClientPostalCode = addAddress.ClientPostalCode,
                CreatedById = user.UserId
            };


            _context.SaveChanges();
        }
        public void UpdateAddress(AddAddress addAddress)
        {
            var user = _context.Users
                .Include(u => u.ClientAddress)
                .FirstOrDefault(u => u.UserId == addAddress.UserId);
            if (user is null) throw new NotFound("Nie znaleziono użytkownika");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, user, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();

            user.ClientAddress.ClientCity = addAddress.ClientCity;
            user.ClientAddress.ClientStreet = addAddress.ClientStreet;
            user.ClientAddress.ClientPostalCode = addAddress.ClientPostalCode;


            _context.SaveChanges();
        }
    }
}