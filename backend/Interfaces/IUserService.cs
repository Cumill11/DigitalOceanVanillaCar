using System.Collections.Generic;
using backend.Dto;
using backend.Models;

namespace backend.Interfaces
{
    public interface IUserService
    {
        void RegisterUser(RegisterUser register);
        public User GetMechanicById(int id);
        string JWT(LoginUser login);
        User GetById(LoginUser login);
        IEnumerable<User> GetAll();
        void Delete(DeleteUser deleteUser);
        void DeleteAdmin(int id);
        void UpdateRole(UpdateRole update);
        void UpdatePassword(UpdatePassword passwordupdate);
        void UpdateUser(UpdateUser userupdate);
        User GetOne(int id);
        void ConfirmRegistrationFromMail(string email, string code);
        void SendResetMail(ResetPassword resetPassword);
        void ResetPassword(ResetPassword resetPassword);
        IEnumerable<User> GetMechanics();

        void AddAddress(AddAddress addAddress);
        void UpdateAddress(AddAddress addAddress);
    }
}