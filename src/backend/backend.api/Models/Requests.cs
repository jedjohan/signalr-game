namespace backend.api.Models;

internal record CreateTeamRequest
{
    public string Name { get; init; } = null!;
    public string Description { get; init; } = null!;
    public GeoLocation Location { get; init; } = null!;
}

internal record CreateGameRequest
{
    public string Name { get; init; } = null!;
    public string Description { get; init; } = null!;
    public string TeamId { get; init; } = null!;
}

internal record JoinGameRequest
{
    public string GameId { get; init; } = null!;
    public string TeamId { get; init; } = null!;
}
