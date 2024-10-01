using backend.api.Models;
using backend.api.Services;
using System.Text.Json;

namespace backend.api.Routes;

public static class TeamEndpoints
{
    private static ILogger Logger = null!;
    internal static readonly List<Team> Teams = [];
    public static RouteGroupBuilder MapTeamEndpoints(this IEndpointRouteBuilder routes, ILogger logger)
    {
        Logger = logger;

        var gameSessionGroup = routes.MapGroup("teams")
            .WithTags("Team endpoints");

        _ = gameSessionGroup.MapGet("/", GetTeams)
            .WithDescription("List teams")
            .WithSummary("List teams and details")
            .Produces<string>()
            .WithOpenApi();

        _ = gameSessionGroup.MapPost("/", CreateTeam)
            .WithDescription("Create team")
            .WithSummary("Create a new team")
            .Produces<string>()
            .ProducesProblem(500)
            .WithOpenApi();

        _ = gameSessionGroup.MapDelete("/{teamId}", DeleteTeam)
            .WithDescription("Delete team")
            .WithSummary("Deletes a team based on teamId")
            .Produces<string>()
            .ProducesProblem(500)
            .WithOpenApi();

        return gameSessionGroup;
    }

    private static IResult GetTeams()
    {
        try
        {
            return TypedResults.Ok(Teams);
        }
        catch (Exception ex)
        {
            Logger.LogCritical(ex, "CRITICAL: Error in GET /teams/");
            return TypedResults.Problem("Failed to get teams");
        }
    }

    private static async Task<IResult> CreateTeam(SignalRHub hub, CreateTeamRequest request, CancellationToken ct)
    {
        try
        {
            var teamId = Guid.NewGuid().ToString();
            var team = new Team
            {
                Id = teamId,
                Name = request.Name,
                Description = request.Description,
                Location = request.Location ?? new GeoLocation("Point", [-73.935242, 40.730610]) // borde vara null, eller kanske mapp center, eller om appen skickar initial location
            };
            Teams.Add(team);

            await hub.SendMessageToAll("TeamCreated", JsonSerializer.Serialize(team), ct);
            return TypedResults.Created(teamId, team);
        }
        catch (Exception ex)
        {
            Logger.LogCritical(ex, "CRITICAL: Error in CREATE /team/");
            return TypedResults.Problem("Failed to create team");
        }
    }

    private static async Task<IResult> DeleteTeam(SignalRHub hub, string teamId, CancellationToken ct)
    {
        try
        {
            var team = Teams.Find(x => x.Id == teamId);
            if (team is null)
                return TypedResults.NotFound($"Team {teamId} not found");

            Teams.RemoveAll(x => x.Id == teamId);
            await hub.SendMessageToAll("TeamRemoved", JsonSerializer.Serialize(team), ct);
            return TypedResults.Accepted($"{team.Name} removed");
        }
        catch (Exception ex)
        {
            Logger.LogCritical(ex, "CRITICAL: Error in DELTE /teams/");
            return TypedResults.Problem("Failed to delete team");
        }
    }
}