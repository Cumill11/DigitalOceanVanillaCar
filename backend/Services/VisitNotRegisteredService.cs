using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using backend.Dto;
using backend.Exceptions;
using backend.Interfaces;
using backend.Models;
using backend.Others;
using FluentEmail.Core;
using FluentEmail.Razor;
using FluentEmail.Smtp;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class VisitNotRegisteredService : IVisitNotRegisteredService
    {
        private const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        private static readonly Random random = new();
        private readonly CarRepairDbContext _context;
        private readonly EmailCredentials _email;

        private readonly string randomvisitcode = new(Enumerable.Repeat(chars, 6)
            .Select(s => s[random.Next(s.Length)]).ToArray());

        public VisitNotRegisteredService(CarRepairDbContext context, EmailCredentials email)
        {
            _context = context;
            _email = email;
        }

        public IEnumerable<VisitNotRegistered> GetAllVisits()
        {
            var visit = _context.VisitNotRegistereds
                .Include(c => c.Payment)
                .ToList();

            return visit;
        }

        public VisitNotRegistered GetVisitByCode(string code)
        {
            var visit = _context.VisitNotRegistereds
                .Include(c => c.Payment)
                .FirstOrDefault(c => c.VisitNotRegisteredCode == code);

            var mechanic = _context.Users.FirstOrDefault(c => c.UserId == visit.MechanicId);

            visit.Mechanic = mechanic;


            return visit;
        }

        public IEnumerable<VisitNotRegistered> GetVisitForMechanic(int id)
        {
            var visit = new List<VisitNotRegistered>();
            var visits = _context.VisitNotRegistereds
                .Include(c => c.Payment)
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

        public void PutVisitNotRegistered(int id, AddNotRegisteredVisit addNotRegisteredVisit)
        {
            var visitcheck = _context.VisitNotRegistereds.FirstOrDefault(c => c.VisitNotRegisteredId == id);

            if (visitcheck.VisitNotRegisteredDateTime == addNotRegisteredVisit.VisitNotRegisteredDateTime)
            {
                var visit1 = _context.VisitNotRegistereds.FirstOrDefault(c => c.VisitNotRegisteredId == id);
                var mechanic = _context.Users.FirstOrDefault(r => r.UserId == addNotRegisteredVisit.MechanicId);

                if (visit1 is null) throw new NotFound("Nie znaleziono wizyty");


                visit1.VisitNotRegisteredDateTime = addNotRegisteredVisit.VisitNotRegisteredDateTime;
                visit1.VisitTypeId = addNotRegisteredVisit.VisitTypeId;
                visit1.MechanicId = addNotRegisteredVisit.MechanicId;


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
                template.AppendLine("Witaj,");
                template.AppendLine("<br>");
                template.AppendLine("Twoja wizyta została edytowana na: @Model.VisitDateTime");
                template.AppendLine("<br>");
                template.AppendLine(
                    "Typ wizyty to: @if (Model.VisitTypeId==3){<b>przegląd</b>}else if(Model.VisitTypeId==2){<b>naprawa</b>}else{<b>Inne</b>}");
                template.AppendLine("<br>");
                template.AppendLine("Twój mechanik to: @Model.Mechanic");
                template.AppendLine("- Vanilla Car");

                Email.DefaultSender = sender;
                Email.DefaultRenderer = new RazorRenderer();

                var email = Email
                    .From("no-reply@vanillacar.me", "VanillaCar")
                    .To(visit1.UserEmail, visit1.UserEmail)
                    .Subject("Edycja wizyty")
                    .UsingTemplate(template.ToString(),
                        new
                        {
                            Mechanic = mechanic.UserName,
                            Email = visit1.UserEmail, VisitDateTime = visit1.VisitNotRegisteredDateTime,
                            visit1.VisitTypeId
                        })
                    .Send();
            }
            else
            {
                var visit = new List<VisitNotRegistered>();

                var visits = _context.VisitNotRegistereds.ToList();

                var count = visits.Count();
                for (var i = 0; i <= count; i++)
                {
                    visit.Add(visits.Find(c =>
                        c.VisitNotRegisteredDateTime == addNotRegisteredVisit.VisitNotRegisteredDateTime &&
                        c.MechanicId == addNotRegisteredVisit.MechanicId));
                    visit.Add(visits.Find(c =>
                        c.VisitNotRegisteredDateTime.AddHours(1) == addNotRegisteredVisit.VisitNotRegisteredDateTime &&
                        c.MechanicId == addNotRegisteredVisit.MechanicId));
                    visit.Add(visits.Find(c =>
                        c.VisitNotRegisteredDateTime.AddHours(-1) == addNotRegisteredVisit.VisitNotRegisteredDateTime &&
                        c.MechanicId == addNotRegisteredVisit.MechanicId));
                    visits.Remove(visits.Find(c =>
                        c.VisitNotRegisteredDateTime == addNotRegisteredVisit.VisitNotRegisteredDateTime &&
                        c.MechanicId == addNotRegisteredVisit.MechanicId));
                    visits.Remove(visits.Find(c =>
                        c.VisitNotRegisteredDateTime.AddHours(1) == addNotRegisteredVisit.VisitNotRegisteredDateTime &&
                        c.MechanicId == addNotRegisteredVisit.MechanicId));
                    visits.Remove(visits.Find(c =>
                        c.VisitNotRegisteredDateTime.AddHours(-1) == addNotRegisteredVisit.VisitNotRegisteredDateTime &&
                        c.MechanicId == addNotRegisteredVisit.MechanicId));
                }

                visit.RemoveAll(item => item == null);

                if (visit.Count == 0)
                {
                    var visit1 = _context.VisitNotRegistereds.FirstOrDefault(c => c.VisitNotRegisteredId == id);
                    var mechanic = _context.Users.FirstOrDefault(r => r.UserId == addNotRegisteredVisit.MechanicId);


                    if (visit1 is null) throw new NotFound("Nie znaleziono wizyty");

                    visit1.VisitNotRegisteredDateTime = addNotRegisteredVisit.VisitNotRegisteredDateTime;
                    visit1.VisitTypeId = addNotRegisteredVisit.VisitTypeId;
                    visit1.MechanicId = addNotRegisteredVisit.MechanicId;


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
                    template.AppendLine("Witaj,");
                    template.AppendLine("<br>");
                    template.AppendLine("Twoja wizyta została edytowana na: @Model.VisitDateTime");
                    template.AppendLine("<br>");
                    template.AppendLine(
                        "Typ wizyty to: @if (Model.VisitTypeId==3){<b>przegląd</b>}else if(Model.VisitTypeId==2){<b>naprawa</b>}else{<b>Inne</b>}");
                    template.AppendLine("<br>");
                    template.AppendLine("Twój mechanik to: @Model.Mechanic");
                    template.AppendLine("- Vanilla Car");

                    Email.DefaultSender = sender;
                    Email.DefaultRenderer = new RazorRenderer();

                    var email = Email
                        .From("no-reply@vanillacar.me", "VanillaCar")
                        .To(visit1.UserEmail, visit1.UserEmail)
                        .Subject("Edycja wizyty")
                        .UsingTemplate(template.ToString(),
                            new
                            {
                                Mechanic = mechanic.UserName,
                                Email = visit1.UserEmail, VisitDateTime = visit1.VisitNotRegisteredDateTime,
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

        public string PostVisitNotRegistered(AddNotRegisteredVisit addNotRegisteredVisit)
        {
            var visit = new List<Visit>();

            var visits = _context.Visits.ToList();

            var count = visits.Count();
            for (var i = 0; i <= count; i++)
            {
                visit.Add(visits.Find(c =>
                    c.VisitDateTime == addNotRegisteredVisit.VisitNotRegisteredDateTime &&
                    c.MechanicId == addNotRegisteredVisit.MechanicId));
                visit.Add(visits.Find(c =>
                    c.VisitDateTime.AddHours(1) == addNotRegisteredVisit.VisitNotRegisteredDateTime &&
                    c.MechanicId == addNotRegisteredVisit.MechanicId));
                visit.Add(visits.Find(c =>
                    c.VisitDateTime.AddHours(-1) == addNotRegisteredVisit.VisitNotRegisteredDateTime &&
                    c.MechanicId == addNotRegisteredVisit.MechanicId));
                visits.Remove(visits.Find(c =>
                    c.VisitDateTime == addNotRegisteredVisit.VisitNotRegisteredDateTime &&
                    c.MechanicId == addNotRegisteredVisit.MechanicId));
                visits.Remove(visits.Find(c =>
                    c.VisitDateTime.AddHours(1) == addNotRegisteredVisit.VisitNotRegisteredDateTime &&
                    c.MechanicId == addNotRegisteredVisit.MechanicId));
                visits.Remove(visits.Find(c =>
                    c.VisitDateTime.AddHours(-1) == addNotRegisteredVisit.VisitNotRegisteredDateTime &&
                    c.MechanicId == addNotRegisteredVisit.MechanicId));
            }

            visit.RemoveAll(item => item == null);

            if (visit.Count == 0)
            {
                var newVisit = new VisitNotRegistered
                {
                    VisitNotRegisteredDateTime = addNotRegisteredVisit.VisitNotRegisteredDateTime,
                    UserEmail = addNotRegisteredVisit.UserEmail,
                    UserTelephone = addNotRegisteredVisit.UserTelephone,
                    VisitTypeId = addNotRegisteredVisit.VisitTypeId,
                    VisitNotRegisteredCode = randomvisitcode,
                    MechanicId = addNotRegisteredVisit.MechanicId
                };
                _context.VisitNotRegistereds.Add(newVisit);
                _context.SaveChanges();


                var mechanic = _context.Users.FirstOrDefault(r => r.UserId == addNotRegisteredVisit.MechanicId);


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
                template.AppendLine("Witaj,");
                template.AppendLine("<br>");
                template.AppendLine("Zarezerwowałeś wizytę na: @Model.VisitDateTime");
                template.AppendLine("<br>");
                template.AppendLine(
                    "Typ wizyty to: @if (Model.VisitTypeId==3){<b>przegląd</b>}else if(Model.VisitTypeId==2){<b>naprawa</b>}else{<b>Inne</b>}");
                template.AppendLine("<br>");
                template.AppendLine("Twój mechanik to: @Model.Mechanic");
                template.AppendLine("<br>");
                template.AppendLine("Twój kod wizyty to: @Model.VisitCode");
                template.AppendLine("<br>");
                template.AppendLine("- Vanilla Car");

                Email.DefaultSender = sender;
                Email.DefaultRenderer = new RazorRenderer();

                var email = Email
                    .From("no-reply@vanillacar.me", "VanillaCar")
                    .To(newVisit.UserEmail, newVisit.UserEmail)
                    .Subject("Potwierdzenie wizyty")
                    .UsingTemplate(template.ToString(),
                        new
                        {
                            Mechanic = mechanic.UserName, Email = newVisit.UserEmail,
                            VisitDateTime = newVisit.VisitNotRegisteredDateTime, newVisit.VisitTypeId,
                            VisitCode = newVisit.VisitNotRegisteredCode
                        })
                    .Send();
                return newVisit.VisitNotRegisteredCode;
            }

            throw new BadRequest("Termin niedostępny");
        }

        public void DeleteVisitNotRegistered(int id)
        {
            var visit = _context.VisitNotRegistereds.FirstOrDefault(u => u.VisitNotRegisteredId == id);

            if (visit is null) throw new NotFound("Nie znaleziono wizyty");

            _context.VisitNotRegistereds.Remove(visit);
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
            template.AppendLine("Witaj");
            template.AppendLine("<br>");
            template.AppendLine("Odwołałeś wizytę na: @Model.VisitDateTime");
            template.AppendLine("<br>");
            template.AppendLine("- Vanilla Car");

            Email.DefaultSender = sender;
            Email.DefaultRenderer = new RazorRenderer();

            var email = Email
                .From("no-reply@vanillacar.me", "VanillaCar")
                .To(visit.UserEmail, visit.UserEmail)
                .Subject("Odwołanie wizyty")
                .UsingTemplate(template.ToString(), new
                {
                    Email = visit.UserEmail, VisitDateTime = visit.VisitNotRegisteredDateTime
                })
                .Send();
        }

        public void IsDone(int id)
        {
            var visit = _context.VisitNotRegistereds.FirstOrDefault(c => c.VisitNotRegisteredId == id);

            if (visit is null) throw new NotFound("Nie znaleziono wizyty");

            visit.IsDone = true;


            _context.SaveChanges();
        }

        public void VisitLog(int id, AddNotRegisteredVisit addNotRegisteredVisit)
        {
            var visit = _context.VisitNotRegistereds.FirstOrDefault(c => c.VisitNotRegisteredId == id);

            if (visit is null) throw new NotFound("Nie znaleziono wizyty");

            visit.VisitNotRegisteredLog = addNotRegisteredVisit.VisitNotRegisteredLog;


            _context.SaveChanges();
        }

        public void RemoveVisitLog(int id)
        {
            var visit = _context.VisitNotRegistereds.FirstOrDefault(c => c.VisitNotRegisteredId == id);

            if (visit is null) throw new NotFound("Nie znaleziono wizyty");
            visit.VisitNotRegisteredLog = null;


            _context.SaveChanges();
        }

        public void VisitPaymentCostUpdate(int id, AddPaymentType addPayment)
        {
            var visit = _context.VisitNotRegistereds.FirstOrDefault(c => c.VisitNotRegisteredId == id);

            if (visit is null) throw new NotFound("Nie znaleziono wizyty");

            var payment = _context.Payments.FirstOrDefault(c => c.PaymentId == visit.PaymentId);

            payment.PaymentCost = addPayment.PaymentCost;


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
            template.AppendLine("Witaj,");
            template.AppendLine("<br>");
            template.AppendLine("Rachunek za wizytę został zaktualizowany, cena to: @Model.Cost");
            template.AppendLine("<br>");
            template.AppendLine("- Vanilla Car");

            Email.DefaultSender = sender;
            Email.DefaultRenderer = new RazorRenderer();

            var email = Email
                .From("no-reply@vanillacar.me", "VanillaCar")
                .To(visit.UserEmail, visit.UserEmail)
                .Subject("Aktualizacja kosztu")
                .UsingTemplate(template.ToString(), new {Email = visit.UserEmail, Cost = payment.PaymentCost})
                .Send();
        }

        public void VisitPaymentCost(int id, AddPaymentType addPayment)
        {
            var visit = _context.VisitNotRegistereds.FirstOrDefault(c => c.VisitNotRegisteredId == id);

            if (visit is null) throw new NotFound("Nie znaleziono wizyty");


            visit.Payment = new Payment
            {
                PaymentCost = addPayment.PaymentCost + " zł",
                IsPayed = false,
                PaymentTypeId = null,
                UserId = null
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
            template.AppendLine("Witaj,");
            template.AppendLine("<br>");
            template.AppendLine("Dostałeś nowy rachunek za wizytę, cena to: @Model.Cost");
            template.AppendLine("<br>");
            template.AppendLine("- Vanilla Car");

            Email.DefaultSender = sender;
            Email.DefaultRenderer = new RazorRenderer();

            var email = Email
                .From("no-reply@vanillacar.me", "VanillaCar")
                .To(visit.UserEmail, visit.UserEmail)
                .Subject("Rachunek za wizytę")
                .UsingTemplate(template.ToString(), new {Email = visit.UserEmail, Cost = payment.PaymentCost})
                .Send();
        }
    }
}