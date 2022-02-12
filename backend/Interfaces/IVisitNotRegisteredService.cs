using System.Collections.Generic;
using backend.Dto;
using backend.Models;

namespace backend.Interfaces
{
    public interface IVisitNotRegisteredService
    {
        public IEnumerable<VisitNotRegistered> GetAllVisits();
        public VisitNotRegistered GetVisitByCode(string code);
        public IEnumerable<VisitNotRegistered> GetVisitForMechanic(int id);
        public void PutVisitNotRegistered(int id, AddNotRegisteredVisit addNotRegisteredVisit);
        public string PostVisitNotRegistered(AddNotRegisteredVisit addNotRegisteredVisit);
        public void DeleteVisitNotRegistered(int id);
        public void IsDone(int id);
        public void VisitLog(int id, AddNotRegisteredVisit addNotRegisteredVisit);
        public void RemoveVisitLog(int id);
        public void VisitPaymentCostUpdate(int id, AddPaymentType addPayment);
        public void VisitPaymentCost(int id, AddPaymentType addPayment);
    }
}