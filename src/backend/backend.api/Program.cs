using backend.api.Routes;
using backend.api.Services;
using backend.ServiceDefaults;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire components.
builder.AddServiceDefaults();
builder.Services.AddOpenApi();

// Add services to the container.
builder.Services.AddProblemDetails();
builder.Services.AddSignalR();
builder.Services.AddCors();

builder.Services.AddHostedService<LocationUpdateWorker>();
builder.Services.AddSingleton<SignalRHub>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseCors(x => x
        .AllowAnyMethod()
        .AllowAnyHeader()
        .SetIsOriginAllowed(_ => true) // allow any origin
        .AllowCredentials()); // allow credentials
}

app.MapOpenApi("/openapi/v1/openapi.json");

app.MapGameSessionEndpoints(app.Logger);
app.MapTeamEndpoints(app.Logger);

app.MapDefaultEndpoints();
app.MapHub<SignalRHub>("/hub");

app.Run();