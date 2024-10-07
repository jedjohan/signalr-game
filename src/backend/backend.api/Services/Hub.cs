using Microsoft.AspNetCore.SignalR;

namespace backend.api.Services;

public class SignalRHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        await Clients.Caller.SendAsync("OnConnected", Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await Clients.All.SendAsync("OnDisconnected", Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task JoinGroup(string groupName, CancellationToken ct)
    {
        if (Clients is not null)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName, ct);
            await Clients.Group(groupName).SendAsync("GroupJoined", Context.ConnectionId, cancellationToken: ct);
        }
    }

    public async Task SendMessage(string user, string message, CancellationToken ct)
    {
        if (Clients is not null)
            await Clients.All.SendAsync("ReceiveMessage", user, message, cancellationToken: ct);
    }

    public async Task SendMessageToGroup(string groupName, string type, string message, CancellationToken ct)
    {
        if (Clients is not null)
            await Clients.Group(groupName).SendAsync(type, message, cancellationToken: ct);
    }

    public async Task SendMessageToAll(string type, string message, CancellationToken ct)
    {
        if (Clients is not null)
            await Clients.All.SendAsync(type, message, cancellationToken: ct);
    }
}