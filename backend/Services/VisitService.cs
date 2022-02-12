using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
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
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class VisitService : IVisitService
    {
        private const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        private static readonly Random random = new();
        private readonly IAuthorizationService _authorizationService;
        private readonly CarRepairDbContext _context;
        private readonly EmailCredentials _email;
        private readonly IUserContextService _userContextService;

        private readonly string randomvisitcode = new(Enumerable.Repeat(chars, 6)
            .Select(s => s[random.Next(s.Length)]).ToArray());


        public VisitService(CarRepairDbContext context, EmailCredentials email, IUserContextService userContextService,
            IAuthorizationService authorizationService)
        {
            _context = context;
            _userContextService = userContextService;
            _authorizationService = authorizationService;
            _email = email;
        }

        public IEnumerable<Visit> GetAllVisits()
        {
            var visits = _context.Visits
                .Include(c => c.User)
                .Include(c => c.User.ClientAddress)
                .Include(c => c.Car.CarName)
                .Include(c => c.Car.CarProduction)
                .Include(c => c.Car)
                .Include(c => c.Delivery)
                .Include(c => c.Payment)
                .Include(c => c.Pickup)
                .ToList();

            return visits;
        }

        public IEnumerable<Visit> GetVisitForUser(int id)
        {
            var visit = new List<Visit>();
            var visits = _context.Visits
                .Include(c => c.User)
                .Include(c => c.User.ClientAddress)
                .Include(c => c.Car.CarName)
                .Include(c => c.Car.CarProduction)
                .Include(c => c.Car)
                .Include(c => c.Delivery)
                .Include(c => c.Payment)
                .Include(c => c.Pickup)
                .ToList();
            var count = visits.Count();
            for (var i = 0; i <= count; i++)
            {
                visit.Add(visits.Find(x => x.UserId == id));
                visits.Remove(visits.Find(x => x.UserId == id));
            }

            visit.RemoveAll(item => item == null);
            if (visit is null) throw new NotFound("Nie znaleziono wizyt");

            return visit;
        }

        public Visit GetVisitByCode(string code)
        {
            var visit = _context.Visits
                .Include(c => c.User)
                .Include(c => c.User.ClientAddress)
                .Include(c => c.Car.CarName)
                .Include(c => c.Car.CarProduction)
                .Include(c => c.Car)
                .Include(c => c.Delivery)
                .Include(c => c.Payment)
                .Include(c => c.Pickup)
                .FirstOrDefault(c => c.VisitCode == code);

            var mechanic = _context.Users.FirstOrDefault(c => c.UserId == visit.MechanicId);

            visit.Mechanic = mechanic;


            return visit;
        }

        public Visit GetOneVisit(int id)
        {
            var visit = _context.Visits.FirstOrDefault(c => c.VisitId == id);

            return visit;
        }

        public IEnumerable<Visit> GetAllVisitsForMechanic(int id)
        {
            var visit = new List<Visit>();
            var visits = _context.Visits
                .Include(c => c.User)
                .Include(c => c.User.ClientAddress)
                .Include(c => c.Car.CarName)
                .Include(c => c.Car.CarProduction)
                .Include(c => c.Car)
                .Include(c => c.Delivery)
                .Include(c => c.Payment)
                .Include(c => c.Pickup)
                .ToList();
            var count = visits.Count();
            for (var i = 0; i <= count; i++)
            {
                visit.Add(visits.Find(x => x.MechanicId == id));
                visits.Remove(visits.Find(x => x.MechanicId == id));
            }

            visit.RemoveAll(item => item == null);
            if (visit is null) throw new NotFound("Nie znaleziono recenzji");

            return visit;
        }

        public IEnumerable<Visit> GetNotPayedVisit(int id)
        {
            var visit = new List<Visit>();
            var visits = _context.Visits
                .Include(c => c.Payment)
                .ToList();
            var count = visits.Count();
            for (var i = 0; i <= count; i++)
            {
                visit.Add(visits.Find(x => x.UserId == id));
                visits.Remove(visits.Find(x => x.UserId == id));
            }

            visit.RemoveAll(item => item == null);

            var NotPayedVisits = new List<Visit>();

            foreach (var item in visit)
                if (item.Payment == null)
                {
                }
                else
                {
                    if (!item.Payment.IsPayed) NotPayedVisits.Add(item);
                }

            return NotPayedVisits;
        }

        public void UpdateVisit(int id, AddVisit updateVisit)
        {
            var visitcheck = _context.Visits.FirstOrDefault(c => c.VisitId == id);

            if (visitcheck.VisitDateTime == updateVisit.VisitDateTime)
            {
                var visit1 = _context.Visits.FirstOrDefault(c => c.VisitId == id);
                var user = _context.Users.FirstOrDefault(r => r.UserId == visit1.UserId);
                var mechanic = _context.Users.FirstOrDefault(r => r.UserId == updateVisit.MechanicId);

                var car = _context.Cars
                    .Include(c => c.CarName)
                    .FirstOrDefault(c => c.CarId == updateVisit.CarId);

                if (visit1 is null) throw new NotFound("Nie znaleziono wizyty");

                var authorizationResult = _authorizationService
                    .AuthorizeAsync(_userContextService.User, visit1, new Operations(CRUD.Update)).Result;

                if (!authorizationResult.Succeeded) throw new Forbid();

                visit1.VisitDateTime = updateVisit.VisitDateTime;
                visit1.VisitTypeId = updateVisit.VisitTypeId;
                visit1.CarId = updateVisit.CarId;
                visit1.MechanicId = updateVisit.MechanicId;


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
                template.AppendLine("Edytowałeś wizytę na: @Model.VisitDateTime");
                template.AppendLine("<br>");
                template.AppendLine(
                    "Typ wizyty to: @if (Model.VisitTypeId==3){<b>przegląd</b>}else if(Model.VisitTypeId==2){<b>naprawa</b>}else{<b>Inne</b>}");
                template.AppendLine("<br>");
                template.AppendLine("Samochód: @Model.CarManufacturer @Model.CarModel @Model.CarPlates");
                template.AppendLine("<br>");
                template.AppendLine("Twój mechanik to: @Model.Mechanic");
                template.AppendLine("- Vanilla Car");

                Email.DefaultSender = sender;
                Email.DefaultRenderer = new RazorRenderer();

                var email = Email
                    .From("no-reply@vanillacar.me", "VanillaCar")
                    .To(user.UserEmail, user.UserName)
                    .Subject("Edycja wizyty")
                    .UsingTemplate(template.ToString(),
                        new
                        {
                            Mechanic = mechanic.UserName, CarManufacturer = car.CarName.CarNameManufacturer,
                            CarModel = car.CarName.CarNameModel,
                            car.CarPlates, FirstName = user.UserName,
                            Email = user.UserEmail,
                            visit1.VisitDateTime,
                            visit1.VisitTypeId
                        })
                    .Send();
            }
            else
            {
                var visit = new List<Visit>();

                var visits = _context.Visits.ToList();

                var count = visits.Count();
                for (var i = 0; i <= count; i++)
                {
                    visit.Add(visits.Find(c =>
                        c.VisitDateTime == updateVisit.VisitDateTime && c.MechanicId == updateVisit.MechanicId));
                    visit.Add(visits.Find(c =>
                        c.VisitDateTime.AddHours(1) == updateVisit.VisitDateTime &&
                        c.MechanicId == updateVisit.MechanicId));
                    visit.Add(visits.Find(c =>
                        c.VisitDateTime.AddHours(-1) == updateVisit.VisitDateTime &&
                        c.MechanicId == updateVisit.MechanicId));
                    visits.Remove(visits.Find(c =>
                        c.VisitDateTime == updateVisit.VisitDateTime && c.MechanicId == updateVisit.MechanicId));
                    visits.Remove(visits.Find(c =>
                        c.VisitDateTime.AddHours(1) == updateVisit.VisitDateTime &&
                        c.MechanicId == updateVisit.MechanicId));
                    visits.Remove(visits.Find(c =>
                        c.VisitDateTime.AddHours(-1) == updateVisit.VisitDateTime &&
                        c.MechanicId == updateVisit.MechanicId));
                }

                visit.RemoveAll(item => item == null);

                if (visit.Count == 0)
                {
                    var visit1 = _context.Visits.FirstOrDefault(c => c.VisitId == id);
                    var user = _context.Users.FirstOrDefault(r => r.UserId == visit1.UserId);
                    var mechanic = _context.Users.FirstOrDefault(r => r.UserId == updateVisit.MechanicId);

                    var car = _context.Cars
                        .Include(c => c.CarName)
                        .FirstOrDefault(c => c.CarId == updateVisit.CarId);

                    if (visit1 is null) throw new NotFound("Nie znaleziono wizyty");

                    var authorizationResult = _authorizationService
                        .AuthorizeAsync(_userContextService.User, visit1, new Operations(CRUD.Update)).Result;

                    if (!authorizationResult.Succeeded) throw new Forbid();

                    visit1.VisitDateTime = updateVisit.VisitDateTime;
                    visit1.VisitTypeId = updateVisit.VisitTypeId;
                    visit1.CarId = updateVisit.CarId;
                    visit1.MechanicId = updateVisit.MechanicId;


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
                    template.AppendLine("Edytowałeś wizytę na: @Model.VisitDateTime");
                    template.AppendLine("<br>");
                    template.AppendLine(
                        "Typ wizyty to: @if (Model.VisitTypeId==3){<b>przegląd</b>}else if(Model.VisitTypeId==2){<b>naprawa</b>}else{<b>Inne</b>}");
                    template.AppendLine("<br>");
                    template.AppendLine("Samochód: @Model.CarManufacturer @Model.CarModel @Model.CarPlates");
                    template.AppendLine("<br>");
                    template.AppendLine("Twój mechanik to: @Model.Mechanic");
                    template.AppendLine("- Vanilla Car");

                    Email.DefaultSender = sender;
                    Email.DefaultRenderer = new RazorRenderer();

                    var email = Email
                        .From("no-reply@vanillacar.me", "VanillaCar")
                        .To(user.UserEmail, user.UserName)
                        .Subject("Edycja wizyty")
                        .UsingTemplate(template.ToString(),
                            new
                            {
                                Mechanic = mechanic.UserName, CarManufacturer = car.CarName.CarNameManufacturer,
                                CarModel = car.CarName.CarNameModel,
                                car.CarPlates, FirstName = user.UserName,
                                Email = user.UserEmail,
                                visit1.VisitDateTime,
                                visit1.VisitTypeId
                            })
                        .Send();
                }
                else
                {
                    throw new BadRequest("Termin już zajęty");
                }
            }
        }

        public void AddPickup(int id, AddPickup addPickup)
        {
            var visit = _context.Visits.FirstOrDefault(c => c.VisitId == id);


            if (visit is null) throw new NotFound("Nie znaleziono wizyty");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, visit, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();

            visit.Pickup = new Pickup
            {
                PickupDateTime = addPickup.PickupDateTime,
                PickupCity = addPickup.PickupCity,
                PickupStreet = addPickup.PickupStreet,
                PickupPostalCode = addPickup.PickupPostalCode,
                CreatedById = _userContextService.GetUserId
            };

            _context.SaveChanges();
        }

        public void UpdatePickup(int id, AddPickup updatePickup)
        {
            var visit = _context.Visits
                .Include(c => c.Pickup)
                .FirstOrDefault(c => c.VisitId == id);


            if (visit is null) throw new NotFound("Nie znaleziono wizyty");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, visit, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();


            visit.Pickup.PickupDateTime = updatePickup.PickupDateTime;
            visit.Pickup.PickupCity = updatePickup.PickupCity;
            visit.Pickup.PickupStreet = updatePickup.PickupStreet;
            visit.Pickup.PickupPostalCode = updatePickup.PickupPostalCode;
            visit.Pickup.CreatedById = _userContextService.GetUserId;


            _context.SaveChanges();
        }

        public void UpdateDelivery(int id, AddDelivery updateDelivery)
        {
            var visit = _context.Visits
                .Include(c => c.Delivery)
                .FirstOrDefault(c => c.VisitId == id);


            if (visit is null) throw new NotFound("Nie znaleziono wizyty");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, visit, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();


            visit.Delivery.DeliveryCity = updateDelivery.DeliveryCity;
            visit.Delivery.DeliveryStreet = updateDelivery.DeliveryStreet;
            visit.Delivery.DeliveryPostalCode = updateDelivery.DeliveryPostalCode;
            visit.Delivery.CreatedById = _userContextService.GetUserId;


            _context.SaveChanges();
        }

        public void AddDateTime(int id, AddDelivery updateDelivery)
        {
            var visit = _context.Visits
                .Include(c => c.Delivery)
                .FirstOrDefault(c => c.VisitId == id);
            var user = _context.Users.FirstOrDefault(r => r.UserId == _userContextService.GetUserId);


            if (visit is null) throw new NotFound("Nie znaleziono wizyty");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, visit, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();


            visit.Delivery.DeliveryDateTime = updateDelivery.DeliveryDateTime;


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
            template.AppendLine("Twój samochód zostanie dostarczony: @Model.DeliveryDateTime");
            template.AppendLine("<br>");
            template.AppendLine("na adres: @Model.DeliveryCity @Model.DeliveryStreet @Model.DeliveryPostalCode");
            template.AppendLine("<br>");
            template.AppendLine("- Vanilla Car");

            Email.DefaultSender = sender;
            Email.DefaultRenderer = new RazorRenderer();

            var email = Email
                .From("no-reply@vanillacar.me", "VanillaCar")
                .To(user.UserEmail, user.UserName)
                .Subject("Edycja wizyty")
                .UsingTemplate(template.ToString(),
                    new
                    {
                        visit.Delivery.DeliveryCity, visit.Delivery.DeliveryStreet, visit.Delivery.DeliveryPostalCode,
                        visit.Delivery.DeliveryDateTime, FirstName = user.UserName, Email = user.UserEmail
                    })
                .Send();
        }

        public void AddDelivery(int id, AddDelivery addDelivery)
        {
            var visit = _context.Visits.FirstOrDefault(c => c.VisitId == id);


            if (visit is null) throw new NotFound("Nie znaleziono wizyty");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, visit, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();


            visit.IsDelivery = true;
            visit.Delivery = new Delivery
            {
                DeliveryDateTime = null,
                DeliveryCity = addDelivery.DeliveryCity,
                DeliveryStreet = addDelivery.DeliveryStreet,
                DeliveryPostalCode = addDelivery.DeliveryPostalCode,
                CreatedById = _userContextService.GetUserId
            };


            _context.SaveChanges();
        }

        public void VisitPay(int id)
        {
            var visit = _context.Visits.FirstOrDefault(c => c.VisitId == id);


            if (visit is null) throw new NotFound("Nie znaleziono wizyty");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, visit, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();

            var payment = _context.Payments.FirstOrDefault(c => c.PaymentId == visit.PaymentId);


            payment.IsPayed = true;


            _context.SaveChanges();
        }

        public void VisitChoosePay(int id, AddPaymentType addpayment)
        {
            var visit = _context.Visits.FirstOrDefault(c => c.VisitId == id);


            if (visit is null) throw new NotFound("Nie znaleziono wizyty");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, visit, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();

            var payment = _context.Payments.FirstOrDefault(c => c.PaymentId == visit.PaymentId);


            payment.PaymentTypeId = addpayment.PaymentTypeId;


            _context.SaveChanges();
        }

        public void VisitPaymentCostUpdate(int id, AddPaymentType addpayment)
        {
            var visit = _context.Visits.FirstOrDefault(c => c.VisitId == id);
            var user = _context.Users.FirstOrDefault(r => r.UserId == visit.UserId);


            if (visit is null) throw new NotFound("Nie znaleziono wizyty");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, visit, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();

            var payment = _context.Payments.FirstOrDefault(c => c.PaymentId == visit.PaymentId);

            payment.PaymentCost = addpayment.PaymentCost;


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
            template.AppendLine("Rachunek za wizytę został zaktualizowany, cena to: @Model.Cost");
            template.AppendLine("<br>");
            template.AppendLine("- Vanilla Car");

            Email.DefaultSender = sender;
            Email.DefaultRenderer = new RazorRenderer();

            var email = Email
                .From("no-reply@vanillacar.me", "VanillaCar")
                .To(user.UserEmail, user.UserName)
                .Subject("Aktualizacja kosztu")
                .UsingTemplate(template.ToString(),
                    new {FirstName = user.UserName, Email = user.UserEmail, Cost = payment.PaymentCost})
                .Send();
        }

        public void VisitPaymentCost(int id, AddPaymentType addpayment)
        {
            var visit = _context.Visits.FirstOrDefault(c => c.VisitId == id);
            var user = _context.Users.FirstOrDefault(r => r.UserId == visit.UserId);


            if (visit is null) throw new NotFound("Nie znaleziono wizyty");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, visit, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();


            visit.Payment = new Payment
            {
                PaymentCost = addpayment.PaymentCost + " zł",
                IsPayed = false,
                PaymentTypeId = null,
                UserId = visit.UserId
            };


            _context.SaveChanges();

            var payment = _context.Payments.FirstOrDefault(c => c.PaymentId == visit.PaymentId);


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
            template.AppendLine("Dostałeś nowy rachunek za wizytę, cena to: @Model.Cost");
            template.AppendLine("<br>");
            template.AppendLine("- Vanilla Car");

            Email.DefaultSender = sender;
            Email.DefaultRenderer = new RazorRenderer();

            var email = Email
                .From("no-reply@vanillacar.me", "VanillaCar")
                .To(user.UserEmail, user.UserName)
                .Subject("Rachunek za wizytę")
                .UsingTemplate(template.ToString(),
                    new {FirstName = user.UserName, Email = user.UserEmail, Cost = payment.PaymentCost})
                .Send();
        }

        public void DeletePickup(int id)
        {
            var visit = _context.Visits.FirstOrDefault(c => c.VisitId == id);

            if (visit is null) throw new NotFound("Nie znaleziono wizyty");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, visit, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();

            var pickup = _context.Pickup.FirstOrDefault(c => c.PickupId == visit.PickupId);

            visit.PickupId = null;

            _context.Pickup.Remove(pickup);


            _context.SaveChanges();
        }

        public void DeleteDelivery(int id)
        {
            var visit = _context.Visits.FirstOrDefault(c => c.VisitId == id);

            if (visit is null) throw new NotFound("Nie znaleziono wizyty");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, visit, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();

            var delivery = _context.Deliveries.FirstOrDefault(c => c.DeliveryId == visit.DeliveryId);

            visit.DeliveryId = null;
            visit.IsDelivery = false;

            _context.Deliveries.Remove(delivery);


            _context.SaveChanges();
        }

        public void DeleteDeliveryDateTime(int id)
        {
            var visit = _context.Visits.FirstOrDefault(c => c.VisitId == id);

            if (visit is null) throw new NotFound("Nie znaleziono wizyty");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, visit, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();

            var delivery = _context.Deliveries.FirstOrDefault(c => c.DeliveryId == visit.DeliveryId);

            delivery.DeliveryDateTime = null;


            _context.SaveChanges();
        }

        public void IsDone(int id)
        {
            var visit = _context.Visits.FirstOrDefault(c => c.VisitId == id);

            if (visit is null) throw new NotFound("Nie znaleziono wizyty");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, visit, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();

            visit.IsDone = true;


            _context.SaveChanges();
        }

        public void VisitLog(int id, AddVisit visitlog)
        {
            var visit = _context.Visits.FirstOrDefault(c => c.VisitId == id);

            if (visit is null) throw new NotFound("Nie znaleziono wizyty");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, visit, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();

            visit.VisitLog = visitlog.VisitLog;


            _context.SaveChanges();
        }

        public void RemoveVisitLog(int id)
        {
            var visit = _context.Visits.FirstOrDefault(c => c.VisitId == id);

            if (visit is null) throw new NotFound("Nie znaleziono wizyty");
            var authorizationResult = _authorizationService
                .AuthorizeAsync(_userContextService.User, visit, new Operations(CRUD.Update)).Result;

            if (!authorizationResult.Succeeded) throw new Forbid();

            visit.VisitLog = null;


            _context.SaveChanges();
        }

        public void AddVisit(AddVisit addVisit)
        {
            var visit = new List<Visit>();

            var visits = _context.Visits.ToList();

            var count = visits.Count();
            for (var i = 0; i <= count; i++)
            {
                visit.Add(visits.Find(c =>
                    c.VisitDateTime == addVisit.VisitDateTime && c.MechanicId == addVisit.MechanicId));
                visit.Add(visits.Find(c =>
                    c.VisitDateTime.AddHours(1) == addVisit.VisitDateTime && c.MechanicId == addVisit.MechanicId));
                visit.Add(visits.Find(c =>
                    c.VisitDateTime.AddHours(-1) == addVisit.VisitDateTime && c.MechanicId == addVisit.MechanicId));
                visits.Remove(visits.Find(c =>
                    c.VisitDateTime == addVisit.VisitDateTime && c.MechanicId == addVisit.MechanicId));
                visits.Remove(visits.Find(c =>
                    c.VisitDateTime.AddHours(1) == addVisit.VisitDateTime && c.MechanicId == addVisit.MechanicId));
                visits.Remove(visits.Find(c =>
                    c.VisitDateTime.AddHours(-1) == addVisit.VisitDateTime && c.MechanicId == addVisit.MechanicId));
            }

            visit.RemoveAll(item => item == null);

            if (visit.Count == 0)
            {
                var newVisit = new Visit
                {
                    VisitDateTime = addVisit.VisitDateTime,
                    VisitTypeId = addVisit.VisitTypeId,
                    CarId = addVisit.CarId,
                    UserId = _userContextService.GetUserId,
                    VisitCode = randomvisitcode,
                    MechanicId = addVisit.MechanicId
                };
                _context.Visits.Add(newVisit);
                _context.SaveChanges();


                var user = _context.Users.FirstOrDefault(r => r.UserId == _userContextService.GetUserId);
                var car = _context.Cars
                    .Include(c => c.CarName)
                    .FirstOrDefault(c => c.CarId == addVisit.CarId);
                var mechanic = _context.Users.FirstOrDefault(r => r.UserId == addVisit.MechanicId);


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
                template.AppendLine("Zarezerwowałeś wizytę na: @Model.VisitDateTime");
                template.AppendLine("<br>");
                template.AppendLine(
                    "Typ wizyty to: @if (Model.VisitTypeId==3){<b>przegląd</b>}else if(Model.VisitTypeId==2){<b>naprawa</b>}else{<b>Inne</b>}");
                template.AppendLine("<br>");
                template.AppendLine("Samochód: @Model.CarManufacturer @Model.CarModel @Model.CarPlates");
                template.AppendLine("<br>");
                template.AppendLine("Twój mechanik to: @Model.Mechanic");
                template.AppendLine("<br>");
                template.AppendLine("- Vanilla Car");

                Email.DefaultSender = sender;
                Email.DefaultRenderer = new RazorRenderer();

                var email = Email
                    .From("no-reply@vanillacar.me", "VanillaCar")
                    .To(user.UserEmail, user.UserName)
                    .Subject("Potwierdzenie wizyty")
                    .UsingTemplate(template.ToString(), new
                    {
                        Mechanic = mechanic.UserName, CarManufacturer = car.CarName.CarNameManufacturer,
                        CarModel = car.CarName.CarNameModel, car.CarPlates, FirstName = user.UserName,
                        Email = user.UserEmail,
                        addVisit.VisitDateTime, addVisit.VisitTypeId
                    })
                    .Send();
            }
            else
            {
                throw new BadRequest("Termin niedostępny");
            }
        }

        public void AddVisitMechanic(AddVisit addVisit)
        {
            var visit = new List<Visit>();

            var visits = _context.Visits.ToList();

            var count = visits.Count();
            for (var i = 0; i <= count; i++)
            {
                visit.Add(visits.Find(c =>
                    c.VisitDateTime == addVisit.VisitDateTime && c.MechanicId == addVisit.MechanicId));
                visit.Add(visits.Find(c =>
                    c.VisitDateTime.AddHours(1) == addVisit.VisitDateTime && c.MechanicId == addVisit.MechanicId));
                visit.Add(visits.Find(c =>
                    c.VisitDateTime.AddHours(-1) == addVisit.VisitDateTime && c.MechanicId == addVisit.MechanicId));
                visits.Remove(visits.Find(c =>
                    c.VisitDateTime == addVisit.VisitDateTime && c.MechanicId == addVisit.MechanicId));
                visits.Remove(visits.Find(c =>
                    c.VisitDateTime.AddHours(1) == addVisit.VisitDateTime && c.MechanicId == addVisit.MechanicId));
                visits.Remove(visits.Find(c =>
                    c.VisitDateTime.AddHours(-1) == addVisit.VisitDateTime && c.MechanicId == addVisit.MechanicId));
            }

            visit.RemoveAll(item => item == null);

            if (visit.Count == 0)
            {
                if (addVisit.VisitDateTime < DateTime.Now)
                {
                    var oldVisit = new Visit
                    {
                        VisitDateTime = addVisit.VisitDateTime,
                        VisitTypeId = addVisit.VisitTypeId,
                        CarId = addVisit.CarId,
                        UserId = addVisit.UserId,
                        VisitCode = randomvisitcode,
                        MechanicId = addVisit.MechanicId,
                        IsDone = true
                    };
                    _context.Visits.Add(oldVisit);
                    _context.SaveChanges();
                }
                else
                {
                    var newVisit = new Visit
                    {
                        VisitDateTime = addVisit.VisitDateTime,
                        VisitTypeId = addVisit.VisitTypeId,
                        CarId = addVisit.CarId,
                        UserId = addVisit.UserId,
                        VisitCode = randomvisitcode,
                        MechanicId = addVisit.MechanicId
                    };
                    _context.Visits.Add(newVisit);
                    _context.SaveChanges();
                }

                var user = _context.Users.FirstOrDefault(r => r.UserId == addVisit.UserId);
                var car = _context.Cars
                    .Include(c => c.CarName)
                    .FirstOrDefault(c => c.CarId == addVisit.CarId);
                var mechanic = _context.Users.FirstOrDefault(r => r.UserId == addVisit.MechanicId);


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
                template.AppendLine("Zarezerwowano dla Ciebie wizytę na: @Model.VisitDateTime");
                template.AppendLine("<br>");
                template.AppendLine(
                    "Typ wizyty to: @if (Model.VisitTypeId==3){<b>przegląd</b>}else if(Model.VisitTypeId==2){<b>naprawa</b>}else{<b>Inne</b>}");
                template.AppendLine("<br>");
                template.AppendLine("Samochód: @Model.CarManufacturer @Model.CarModel @Model.CarPlates");
                template.AppendLine("<br>");
                template.AppendLine("Twój mechanik to: @Model.Mechanic");
                template.AppendLine("<br>");
                template.AppendLine("- Vanilla Car");

                Email.DefaultSender = sender;
                Email.DefaultRenderer = new RazorRenderer();

                var email = Email
                    .From("no-reply@vanillacar.me", "VanillaCar")
                    .To(user.UserEmail, user.UserName)
                    .Subject("Potwierdzenie wizyty")
                    .UsingTemplate(template.ToString(),
                        new
                        {
                            Mechanic = mechanic.UserName, CarManufacturer = car.CarName.CarNameManufacturer,
                            CarModel = car.CarName.CarNameModel,
                            car.CarPlates, FirstName = user.UserName,
                            Email = user.UserEmail,
                            addVisit.VisitDateTime,
                            addVisit.VisitTypeId
                        })
                    .Send();
            }
            else
            {
                throw new BadRequest("Termin niedostępny");
            }
        }

        public void DeleteVisit(int id)
        {
            var visit = _context.Visits.FirstOrDefault(u => u.VisitId == id);
            var user = _context.Users.FirstOrDefault(r => r.UserId == _userContextService.GetUserId);


            if (visit is null) throw new NotFound("Nie znaleziono wizyty");

            _context.Visits.Remove(visit);
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
            template.AppendLine("Odwołałeś wizytę na: @Model.VisitDateTime");
            template.AppendLine("<br>");
            template.AppendLine("- Vanilla Car");

            Email.DefaultSender = sender;
            Email.DefaultRenderer = new RazorRenderer();

            var email = Email
                .From("no-reply@vanillacar.me", "VanillaCar")
                .To(user.UserEmail, user.UserName)
                .Subject("Odwołanie wizyty")
                .UsingTemplate(template.ToString(), new
                {
                    FirstName = user.UserName,
                    Email = user.UserEmail, visit.VisitDateTime
                })
                .Send();
        }
    }
}