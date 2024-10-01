namespace backend.api.Models;

internal record Team
{
    public string? Id { get; set; }
    public string? TeamCaptainId { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public GeoLocation? Location { get; set; }
}

internal record GameSession
{
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public bool Running { get; set; }
    public Team? Team1 { get; set; }
    public Team? Team2 { get; set; }
}

internal record GeoLocation(string Type, double[] Coordinates);