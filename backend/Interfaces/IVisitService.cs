using System.Collections.Generic;
using backend.Dto;
using backend.Models;

namespace backend.Interfaces
{
    public interface IVisitService
    {
        public IEnumerable<Visit> GetAllVisits();
        public IEnumerable<Visit> GetVisitForUser(int id);
        public Visit GetVisitByCode(string code);
        public Visit GetOneVisit(int id);
        public IEnumerable<Visit> GetAllVisitsForMechanic(int id);
        public IEnumerable<Visit> GetNotPayedVisit(int id);
        public void UpdateVisit(int id, AddVisit updateVisit);
        public void AddPickup(int id, AddPickup addPickup);
        public void UpdatePickup(int id, AddPickup updatePickup);
        public void UpdateDelivery(int id, AddDelivery updateDelivery);
        public void AddDateTime(int id, AddDelivery updateDelivery);
        public void AddDelivery(int id, AddDelivery addDelivery);
        public void VisitPay(int id);
        public void VisitChoosePay(int id, AddPaymentType addpayment);
        public void VisitPaymentCostUpdate(int id, AddPaymentType addpayment);
        public void VisitPaymentCost(int id, AddPaymentType addpayment);
        public void DeletePickup(int id);
        public void DeleteDelivery(int id);
        public void DeleteDeliveryDateTime(int id);
        public void IsDone(int id);
        public void VisitLog(int id, AddVisit visitlog);
        public void RemoveVisitLog(int id);
        public void AddVisit(AddVisit addVisit);
        public void AddVisitMechanic(AddVisit addVisit);
        public void DeleteVisit(int id);
    }
}