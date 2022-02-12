using System.Collections.Generic;
using backend.Models;

namespace backend.Interfaces
{
    public interface IPaymentService
    {
        public IEnumerable<Payment> GetPayments();
        public IEnumerable<Payment> GetPaymentForUser(int id);
    }
}