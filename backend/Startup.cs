using System.Text;
using backend.Dto;
using backend.Handlers;
using backend.Interfaces;
using backend.Models;
using backend.Others;
using backend.Services;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var authentication = new Authentication();


            Configuration.GetSection("Authentication").Bind(authentication);


            services.AddSingleton(authentication);
            services.AddSingleton(Configuration.GetSection("Smtp").Get<EmailCredentials>());
            services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = "Bearer";
                option.DefaultScheme = "Bearer";
                option.DefaultChallengeScheme = "Bearer";
            }).AddJwtBearer(cfg =>
            {
                cfg.RequireHttpsMetadata = false;
                cfg.SaveToken = true;
                cfg.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = authentication.JwtIssuer,
                    ValidAudience = authentication.JwtIssuer,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authentication.JwtKey))
                };
            });
            services.AddScoped<IAuthorizationHandler, CarHandler>();
            services.AddScoped<IAuthorizationHandler, UserHandler>();
            services.AddScoped<IAuthorizationHandler, DeliveryHandler>();
            services.AddScoped<IAuthorizationHandler, PaymentHandler>();
            services.AddScoped<IAuthorizationHandler, VisitHandler>();
            services.AddScoped<IAuthorizationHandler, ReviewHandler>();
            services.AddScoped<IAuthorizationHandler, MechanicReviewHandler>();


            services.AddControllers().AddFluentValidation();

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ICarService, CarService>();
            services.AddScoped<IReviewService, ReviewService>();
            services.AddScoped<IMechanicService, MechanicReviewService>();
            services.AddScoped<IVisitService, VisitService>();
            services.AddScoped<IVisitNotRegisteredService, VisitNotRegisteredService>();
            services.AddScoped<ICarNameService, CarNameService>();
            services.AddScoped<ICarProductionService, CarProductionService>();


            services.AddScoped<Errors>();
            services.AddDbContext<CarRepairDbContext>(options =>
                options.UseNpgsql(Configuration.GetConnectionString("CarRepairDbConnection")));
            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
            services.AddScoped<IValidator<RegisterUser>, RegisterValidator>();
            services.AddScoped<IValidator<LoginUser>, LoginValidator>();
            services.AddScoped<IValidator<ResetPassword>, ResetPasswordValidator>();
            services.AddScoped<IValidator<UpdatePassword>, UpdatePasswordValidator>();
            services.AddScoped<IValidator<AddCar>, CarValidator>();
            services.AddScoped<IValidator<DeleteUser>, DeleteUserValidator>();
            services.AddScoped<IValidator<UpdateUser>, UpdateUserValidator>();
            services.AddScoped<IUserContextService, UserContextService>();
            services.AddHttpContextAccessor();
            services.AddScoped<Seeder>();
            services.AddSwaggerGen(c => { c.SwaggerDoc("v1", new OpenApiInfo {Title = "backend", Version = "v1"}); });
            services.AddCors(options =>
            {
                options.AddPolicy("FrontEndClient", builder =>
                    builder.AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .SetIsOriginAllowed(origin => true)
                        .WithOrigins(Configuration["AllowedOrigins"])
                );
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, Seeder seeder)
        {
            seeder.Seed();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "backend v1"));
            }

            app.UseAuthentication();
            app.UseCors("FrontEndClient");
            app.UseMiddleware<Errors>();

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}