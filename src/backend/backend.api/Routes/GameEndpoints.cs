using backend.api.Models;
using backend.api.Services;
using System.Text.Json;

namespace backend.api.Routes;

public static class GameEndpoints
{
    private static ILogger Logger = null!;
    internal static readonly List<GameSession> GameSessions = [];
    public static RouteGroupBuilder MapGameSessionEndpoints(this IEndpointRouteBuilder routes, ILogger logger)
    {
        Logger = logger;

        var gameSessionGroup = routes.MapGroup("games")
            .WithTags("Game endpoints");

        _ = gameSessionGroup.MapGet("/", GetGames)
            .WithDescription("List games")
            .WithSummary("List games and details")
            .Produces<string>()
            .WithOpenApi();

        _ = gameSessionGroup.MapPost("/join", JoinGame)
            .WithDescription("Join a game")
            .WithSummary("Join a game based on Id")
            .Produces<string>()
            .ProducesProblem(500)
            .WithOpenApi();

        _ = gameSessionGroup.MapPost("/create", CreateGame)
            .WithDescription("Join a game")
            .WithSummary("Join a game based on Id")
            .Produces<string>()
            .ProducesProblem(500)
            .WithOpenApi();

        //_ = gameSessionGroup.MapPost("/leave", LeaveGame)
        //    .WithDescription("Join a game")
        //    .WithSummary("Join a game based on Id")
        //    .Produces<string>()
        //    .ProducesProblem(500)
        //    .WithOpenApi();

        return gameSessionGroup;
    }

    private static async Task<IResult> JoinGame(SignalRHub hub, JoinGameRequest request, CancellationToken ct)
    {
        try
        {
            var game = GameSessions.Find(x => x.Id == request.GameId);
            if (game is null)
                return TypedResults.NotFound($"Game with id {request.GameId} not found");

            var team = TeamEndpoints.Teams.Find(x => x.Id == request.TeamId);
            if (team is null)
                return TypedResults.NotFound($"Team with id {request.TeamId} not found");

            if (game.Team1 is null)
                game.Team1 = team;
            else if (game.Team2 is null)
                game.Team2 = team;
            else
                return TypedResults.Problem("Game is full");

            await hub.JoinGroup(game.Id!, ct);
            await hub.SendMessageToGroup(game.Id!, "TeamJoinedGame", JsonSerializer.Serialize(team), ct);
            return TypedResults.Ok(game);
        }
        catch (Exception ex)
        {
            Logger.LogCritical(ex, "CRITICAL: Error in POST /join/");
            return TypedResults.Problem("Failed to join game");
        }
    }

    private static async Task<IResult> CreateGame(HttpContext httpContext, SignalRHub hub, CreateGameRequest request, CancellationToken ct)
    {
        try
        {
            var team = TeamEndpoints.Teams.Find(x => x.Id == request.TeamId);
            if (team is null)
                return TypedResults.NotFound($"Team with id {request.TeamId} not found");

            var gameId = Guid.NewGuid().ToString();
            await hub.JoinGroup(gameId, ct);
            var game = new GameSession
            {
                Id = gameId,
                Name = request.Name,
                Team1 = team,
                Team2 = null,
                Description = request.Description
            };
            GameSessions.Add(game);
            await hub.SendMessageToGroup(gameId, "GameCreated", JsonSerializer.Serialize(game), ct);
            return TypedResults.Ok(game);
        }
        catch (Exception ex)
        {
            Logger.LogCritical(ex, "CRITICAL: Error in GET /suppliers/");
            return TypedResults.Problem($"Failed to get suppliers. Trace ID: {httpContext.TraceIdentifier}");
        }
    }

    private static IResult GetGames(HttpContext httpContext)
    {
        try
        {
            return TypedResults.Ok(GameSessions);
        }
        catch (Exception ex)
        {
            Logger.LogCritical(ex, "CRITICAL: Error in GET /suppliers/");
            return TypedResults.Problem($"Failed to get suppliers. Trace ID: {httpContext.TraceIdentifier}");
        }
    }
}