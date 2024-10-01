using backend.api.Models;
using backend.api.Routes;
using System.Text.Json;

namespace backend.api.Services;

public class LocationUpdateWorker(ILogger<LocationUpdateWorker> logger, SignalRHub hub) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        while (!ct.IsCancellationRequested)
        {
            logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
            await Task.Delay(4000, ct);

            foreach (var game in GameEndpoints.GameSessions)
            {
                if (game.Team1 is not null) game.Team1.Location = new GeoLocation("Point", [RandomNumber(-180, 180), RandomNumber(-90, 90)]);
                if (game.Team2 is not null) game.Team2.Location = new GeoLocation("Point", [RandomNumber(-180, 180), RandomNumber(-90, 90)]);

                var team1Data = new { game.Team1?.Name, game.Team1?.Location };
                var team2Data = new { game.Team2?.Name, game.Team2?.Location };

                if (game.Team1 is not null) await hub.SendMessageToGroup(game.Id!, "LocationUpdate", JsonSerializer.Serialize(team1Data), ct);
                if (game.Team2 is not null) await hub.SendMessageToGroup(game.Id!, "LocationUpdate", JsonSerializer.Serialize(team2Data), ct);

                logger.LogInformation("Location update sent for game {gameId}", game.Id);

                // 
            }
        }
    }

    private static double RandomNumber(int v1, int v2) => (new Random().NextDouble() * (v2 - v1)) + v1;
}