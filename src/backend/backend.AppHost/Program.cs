var builder = DistributedApplication.CreateBuilder(args);

var _ = builder.AddProject<Projects.backend_api>("api");

builder.Build().Run();
