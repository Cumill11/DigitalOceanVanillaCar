using System;
using System.Collections.Generic;
using System.Linq;
using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Others
{
    public class Seeder
    {
        private readonly CarRepairDbContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;

        public Seeder(CarRepairDbContext context, IPasswordHasher<User> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public void Seed()
        {
            if (_context.Database.CanConnect())
            {
                if (!_context.Roles.Any())
                {
                    var roles = GetRoles();
                    _context.Roles.AddRange(roles);
                    _context.SaveChanges();
                }

                if (!_context.Users.Any())
                {
                    var users = GetUsers();
                    _context.Users.AddRange(users);
                    _context.SaveChanges();
                }

                if (!_context.FuelTypes.Any()) GetFuel();
                if (!_context.CarProductions.Any()) GetCarProduction();
                if (!_context.Cars.Any())
                {
                    var cars = GetCars();
                    _context.Cars.AddRange(cars);
                    _context.SaveChanges();
                }

                if (!_context.PaymentTypes.Any()) GetPaymentsTypes();
                if (!_context.MechanicReviewScores.Any()) GetMechanicReviewScores();
                if (!_context.MechanicReviews.Any())
                {
                    var mechanicreview = GetMechanicReview();
                    _context.MechanicReviews.AddRange(mechanicreview);
                    _context.SaveChanges();
                }

                if (!_context.Reviews.Any())
                {
                    var review = GetReview();
                    _context.Reviews.AddRange(review);
                    _context.SaveChanges();
                }

                if (!_context.VisitTypes.Any()) GetVisitTypes();
                if (!_context.Visits.Any())
                {
                    var visit = GetVisits();
                    _context.Visits.AddRange(visit);
                    _context.SaveChanges();
                }
            }
        }

        private IEnumerable<Role> GetRoles()
        {
            var roles = new List<Role>
            {
                new()
                {
                    RoleName = "User"
                },
                new()
                {
                    RoleName = "Mechanic"
                },
                new()
                {
                    RoleName = "Admin"
                },
                new()
                {
                    RoleName = "Boss"
                }
            };

            return roles;
        }

        private void GetPaymentsTypes()
        {
            var paymenttypes = new List<PaymentType>
            {
                new()
                {
                    PaymentTypeName = "Inne"
                },
                new()
                {
                    PaymentTypeName = "Blik"
                },
                new()
                {
                    PaymentTypeName = "Karta"
                },
                new()
                {
                    PaymentTypeName = "Gotówka"
                }
            };
            foreach (var item in paymenttypes)
            {
                _context.PaymentTypes.Add(item);
                _context.SaveChanges();
            }
        }

        private void GetMechanicReviewScores()
        {
            var mechanicreviewscores = new List<MechanicReviewScore>
            {
                new()
                {
                    MechanicReviewScoreName = 5
                },
                new()
                {
                    MechanicReviewScoreName = 4
                },
                new()
                {
                    MechanicReviewScoreName = 3
                },
                new()
                {
                    MechanicReviewScoreName = 2
                },
                new()
                {
                    MechanicReviewScoreName = 1
                }
            };
            foreach (var item in mechanicreviewscores)
            {
                _context.MechanicReviewScores.Add(item);
                _context.SaveChanges();
            }
        }

        private IEnumerable<MechanicReview> GetMechanicReview()
        {
            var mechanicreview = new List<MechanicReview>
            {
                new()
                {
                    MechanicReviewName = "spoko ziomek",
                    MechanicReviewScoreId = 5,
                    UserId = 1,
                    MechanicId = 2
                },
                new()
                {
                    MechanicReviewName = "wszystko spoko, ale moglobyc lepiej",
                    MechanicReviewScoreId = 4,
                    UserId = 3,
                    MechanicId = 2
                }
            };

            return mechanicreview;
        }

        private IEnumerable<Review> GetReview()
        {
            var reviews = new List<Review>
            {
                new()
                {
                    ReviewName = "ok.",
                    MechanicReviewScoreId = 5,
                    UserId = 1
                },
                new()
                {
                    ReviewName = "moglobyc lepiej",
                    MechanicReviewScoreId = 3,
                    UserId = 3
                }
            };

            return reviews;
        }

        private void GetVisitTypes()
        {
            var visittypes = new List<VisitType>
            {
                new()
                {
                    VisitTypeName = "Naprawa mechaniczna"
                },
                new()
                {
                    VisitTypeName = "Naprawa elektyczna"
                },
                new()
                {
                    VisitTypeName = "Naprawa kompleksowa"
                },
                new()
                {
                    VisitTypeName = "Naprawa powypadkowa"
                },
                new()
                {
                    VisitTypeName = "Naprawa inna"
                },
                new()
                {
                    VisitTypeName = "Konsultacja"
                },
                new()
                {
                    VisitTypeName = "Przegląd"
                },
                new()
                {
                    VisitTypeName = "Wymiana opon"
                },
                new()
                {
                    VisitTypeName = "Nie wiem"
                },
                new()
                {
                    VisitTypeName = "Inne"
                }
            };
            foreach (var item in visittypes)
            {
                _context.VisitTypes.Add(item);
                _context.SaveChanges();
            }
        }

        private IEnumerable<Visit> GetVisits()
        {
            var visits = new List<Visit>
            {
                new()
                {
                    VisitDateTime = new DateTime(2020, 5, 5, 7, 0, 0),
                    VisitLog = "szybko poszło",
                    UserId = 1,
                    VisitTypeId = 1,
                    CarId = 1,
                    Delivery = new Delivery
                    {
                        DeliveryCity = "Kraków",
                        DeliveryStreet = "Krakowska",
                        DeliveryPostalCode = "12-120",
                        CreatedById = 1
                    },
                    Payment = new Payment
                    {
                        PaymentCost = "123 zł",
                        PaymentTypeId = 1,
                        UserId = 1
                    }
                },
                new()
                {
                    VisitDateTime = new DateTime(2020, 5, 5, 7, 0, 0),
                    VisitLog = "szybko poszło",
                    UserId = 2,
                    VisitTypeId = 2,
                    CarId = 2,
                    Delivery = new Delivery
                    {
                        DeliveryCity = "Katowice",
                        DeliveryStreet = "Krakowska",
                        DeliveryPostalCode = "10-100",
                        CreatedById = 2
                    },
                    Payment = new Payment
                    {
                        PaymentCost = "456 zł",
                        PaymentTypeId = 2,
                        UserId = 2
                    }
                },
                new()
                {
                    VisitDateTime = new DateTime(2020, 5, 5, 7, 0, 0),
                    VisitLog = "szybko poszło",
                    UserId = 3,
                    VisitTypeId = 1,
                    CarId = 3,
                    Delivery = new Delivery
                    {
                        DeliveryCity = "Gdańsk",
                        DeliveryStreet = "Krakowska",
                        DeliveryPostalCode = "00-120",
                        CreatedById = 3
                    },
                    Payment = new Payment
                    {
                        PaymentCost = "789 zł",
                        PaymentTypeId = 3,
                        UserId = 3
                    }
                }
            };

            return visits;
        }

        private void GetFuel()
        {
            var fuels = new List<FuelType>
            {
                new()
                {
                    FuelTypeName = "Benzyna"
                },
                new()
                {
                    FuelTypeName = "Diesel"
                },
                new()
                {
                    FuelTypeName = "Elektryczny"
                },
                new()
                {
                    FuelTypeName = "Benzyna + LPG"
                },
                new()
                {
                    FuelTypeName = "Benzyna + CNG"
                },
                new()
                {
                    FuelTypeName = "Hybryda"
                },
                new()
                {
                    FuelTypeName = "Wodór"
                },
                new()
                {
                    FuelTypeName = "Inne"
                }
            };

            foreach (var item in fuels)
            {
                _context.FuelTypes.Add(item);
                _context.SaveChanges();
            }
        }

        private void GetCarProduction()
        {
            for (var i = 2022; i >= 1920; i--)
            {
                var year = new CarProduction
                {
                    CarProductionYear = i
                };
                _context.CarProductions.Add(year);
                _context.SaveChanges();
            }
        }

        private IEnumerable<Car> GetCars()
        {
            var cars = new List<Car>
            {
                new()
                {
                    CarNameId = 1,
                    CarProductionId = 1,
                    FuelTypeId = 2,
                    CarVin = "wbapg11030e789456",
                    CarPlates = "KNT 12345",
                    UserId = 1
                },
                new()
                {
                    CarNameId = 100,
                    CarProductionId = 50,
                    FuelTypeId = 2,
                    CarVin = "wbapg11030e583680",
                    CarPlates = "KR 12345",

                    UserId = 2
                },

                new()
                {
                    CarNameId = 16,
                    CarProductionId = 16,
                    FuelTypeId = 1,
                    CarVin = "abce11030e583680",
                    CarPlates = "SK 12345",

                    UserId = 3
                }
            };
            return cars;
        }

        private IEnumerable<User> GetUsers()
        {
            var user = new User
            {
                UserEmail = "user@vanillacar.me",
                UserName = "user",
                UserSurname = "user",
                UserPassword = "user123",
                UserTelephone = "123456789",
                UserConfirmRegistration = true,
                RoleId = 1,

                ClientAddress = new ClientAddress
                {
                    ClientCity = "Katowice",
                    ClientStreet = "Katowicka 11a",
                    ClientPostalCode = "34-567",
                    CreatedById = 1
                }
            };
            var hashedPasswordUser = _passwordHasher.HashPassword(user, user.UserPassword);
            user.UserPassword = hashedPasswordUser;

            var mechanic = new User
            {
                UserEmail = "mechanic@vanillacar.me",
                UserName = "mechanic",
                UserSurname = "mechanic",
                UserPassword = "mechanic123",
                UserTelephone = "987654321",
                UserConfirmRegistration = true,
                RoleId = 2,

                ClientAddress = new ClientAddress
                {
                    ClientCity = "Kraków",
                    ClientStreet = "Krakowska",
                    ClientPostalCode = "12-123",
                    CreatedById = 2
                }
            };
            var hashedPasswordMechanic = _passwordHasher.HashPassword(mechanic, mechanic.UserPassword);
            mechanic.UserPassword = hashedPasswordMechanic;

            var admin = new User
            {
                UserEmail = "admin@vanillacar.me",
                UserName = "admin",
                UserSurname = "admin",
                UserPassword = "admin123",
                UserTelephone = "123987456",
                UserConfirmRegistration = true,
                RoleId = 3,

                ClientAddress = new ClientAddress
                {
                    ClientCity = "Monachium",
                    ClientStreet = "BahnhofStrasse",
                    ClientPostalCode = "123465",
                    CreatedById = 3
                }
            };
            var hashedPasswordAdmin = _passwordHasher.HashPassword(admin, admin.UserPassword);
            admin.UserPassword = hashedPasswordAdmin;

            var boss = new User
            {
                UserEmail = "boss@vanillacar.me",
                UserName = "boss",
                UserSurname = "boss",
                UserPassword = "boss123",
                UserTelephone = "123987456",
                UserConfirmRegistration = true,
                RoleId = 4,

                ClientAddress = new ClientAddress
                {
                    ClientCity = "Wrocław",
                    ClientStreet = "wrocławska",
                    ClientPostalCode = "11-111",
                    CreatedById = 4
                }
            };
            var hashedPasswordBoss = _passwordHasher.HashPassword(boss, boss.UserPassword);
            boss.UserPassword = hashedPasswordBoss;

            var users = new List<User>
            {
                user,
                mechanic,
                admin,
                boss
            };

            return users;
        }
    }
}