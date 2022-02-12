using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using backend.Models;
using FluentEmail.Core;
using FluentEmail.Razor;
using FluentEmail.Smtp;
using Microsoft.EntityFrameworkCore;

namespace przypomnienie
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            using var context = new CarRepairDbContext();
            var visitsnotregistered = context.VisitNotRegistereds
                .ToList();
            var visits = context.Visits
                .Include(c => c.User)
                .Include(c => c.User.ClientAddress)
                .Include(c => c.Car.CarName)
                .Include(c => c.Car.CarProduction)
                .Include(c => c.Car)
                .Include(c => c.Delivery)
                .Include(c => c.Payment)
                .Include(c => c.Pickup)
                .ToList();


            foreach (var item in visitsnotregistered)
            {
                var visitdate = item.VisitNotRegisteredDateTime;
                var now = DateTime.Now;
                var difference = (now - visitdate).TotalDays;
                if (difference > -1 && difference < 0)
                {
                    if (item.ReminderSent == false)
                    {
                        var mechanic = context.Users.FirstOrDefault(r => r.UserId == item.MechanicId);


                        var sender = new SmtpSender(() => new SmtpClient("smtp.eu.mailgun.org")
                        {
                            UseDefaultCredentials = false,
                            DeliveryMethod = SmtpDeliveryMethod.Network,
                            Port = 587,
                            Credentials = new NetworkCredential("no-reply@vanillacar.me",
                                "3a379198c9f026970f5c65d4f72ef9fe-10eedde5-3cd980fe"),
                            EnableSsl = true
                        });

                        StringBuilder template = new();
                        template.AppendLine("Witaj,");
                        template.AppendLine("<br>");
                        template.AppendLine("Twoja wizyta obędzie się: @Model.VisitDateTime");
                        template.AppendLine("<br>");
                        template.AppendLine(
                            "Typ wizyty to: @if (Model.VisitTypeId==3){<b>przegląd</b>}else if(Model.VisitTypeId==2){<b>naprawa</b>}else{<b>Inne</b>}");
                        template.AppendLine("<br>");
                        template.AppendLine("Twój mechanik to: @Model.Mechanic");
                        template.AppendLine("<br>");
                        template.AppendLine("Twój kod to: @Model.VisitCode");
                        template.AppendLine("<br>");
                        template.AppendLine(
                            "Szczegoły wizyty @Model.VisitLink ");
                        template.AppendLine("<br>");
                        template.AppendLine("- Vanilla Car");

                        Email.DefaultSender = sender;
                        Email.DefaultRenderer = new RazorRenderer();

                        var email = Email
                            .From("no-reply@vanillacar.me", "VanillaCar")
                            .To(item.UserEmail, item.UserEmail)
                            .Subject("Przypomnienie wizyty")
                            .UsingTemplate(template.ToString(),
                                new
                                {
                                    VisitLink = "http://vanillacar.me/codenotregistered?code=" +
                                                item.VisitNotRegisteredCode,
                                    Mechanic = mechanic.UserName,
                                    Email = item.UserEmail, VisitDateTime = item.VisitNotRegisteredDateTime,
                                    VisitTypeId = item.VisitNotRegisteredId
                                })
                            .Send();
                        item.ReminderSent = true;
                        context.SaveChanges();
                    }
                    else
                    {
                        Console.WriteLine("Już wysłano powiadomienie");
                    }
                }
            }

            foreach (var item in visits)
            {
                var visitdate = item.VisitDateTime;
                var now = DateTime.Now;
                var difference = (now - visitdate).TotalDays;
                if (difference > -1 && difference < 0)
                {
                    if (item.ReminderSent == false)
                    {

                        var car = context.Cars
                            .Include(c => c.CarName)
                            .FirstOrDefault(c => c.CarId == item.CarId);

                        var mechanic = context.Users.FirstOrDefault(r => r.UserId == item.MechanicId);

                        var sender = new SmtpSender(() => new SmtpClient("smtp.eu.mailgun.org")
                        {
                            UseDefaultCredentials = false,
                            DeliveryMethod = SmtpDeliveryMethod.Network,
                            Port = 587,
                            Credentials = new NetworkCredential("no-reply@vanillacar.me",
                                "3a379198c9f026970f5c65d4f72ef9fe-10eedde5-3cd980fe"),
                            EnableSsl = true
                        });

                        StringBuilder template = new();
                        template.AppendLine("Witaj, @Model.FirstName,");
                        template.AppendLine("<br>");
                        template.AppendLine("Twoja wizyta odbędzie się: @Model.VisitDateTime");
                        template.AppendLine("<br>");
                        template.AppendLine(
                            "Typ wizyty to: @if (Model.VisitTypeId==3){<b>przegląd</b>}else if(Model.VisitTypeId==2){<b>naprawa</b>}else{<b>Inne</b>}");
                        template.AppendLine("<br>");
                        template.AppendLine("Samochód: @Model.CarManufacturer @Model.CarModel @Model.CarPlates");
                        template.AppendLine("<br>");
                        template.AppendLine("Twój mechanik to: @Model.Mechanic");
                        template.AppendLine("<br>");
                        template.AppendLine(
                            "Szczegoły wizyty @Model.VisitLink ");
                        template.AppendLine("<br>");
                        template.AppendLine("- Vanilla Car");

                        Email.DefaultSender = sender;
                        Email.DefaultRenderer = new RazorRenderer();

                        var email = Email
                            .From("no-reply@vanillacar.me", "VanillaCar")
                            .To(item.User.UserEmail, item.User.UserName)
                            .Subject("Przypomnienie wizyty")
                            .UsingTemplate(template.ToString(),
                                new
                                {
                                    Mechanic = mechanic.UserName, CarManufacturer = car.CarName.CarNameManufacturer,
                                    CarModel = car.CarName.CarNameModel, car.CarPlates,
                                    FirstName = item.User.UserName, Email = item.User.UserEmail, item.VisitDateTime,
                                    item.VisitTypeId,
                                    VisitLink = "http://vanillacar.me/code?code=" + item.VisitCode
                                })
                            .Send();

                        item.ReminderSent = true;
                        context.SaveChanges();
                    }
                    else
                    {
                        Console.WriteLine("Już wysłano powiadomienie");
                    }
                }
            }

            var users = context.Users.ToList();

            foreach (var item in users)
            {
                var userregistertime = item.UserRegisterTime;
                var now = DateTime.Now;
                var difference = (now - userregistertime).TotalDays;
                if (difference >1)
                {
                    if (item.UserConfirmRegistration == false)
                    {
                        context.Users.Remove(item);
                        context.SaveChanges();
                    }
                }
            }
        }
    }
}
