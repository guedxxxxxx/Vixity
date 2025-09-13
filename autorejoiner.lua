-- // Server Hop Every 20 Minutes (Avoid Same Server) // --

local TeleportService = game:GetService("TeleportService")
local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")
local LocalPlayer = Players.LocalPlayer

local PlaceId = game.PlaceId
local JobId = game.JobId

-- Function to get a new server
local function findNewServer()
    local servers = {}
    local cursor = ""
    local foundServer = nil

    while true do
        local url = ("https://games.roblox.com/v1/games/%d/servers/Public?sortOrder=Asc&limit=100%s"):format(PlaceId, cursor ~= "" and "&cursor="..cursor or "")
        local success, result = pcall(function()
            return HttpService:JSONDecode(game:HttpGet(url))
        end)

        if success and result and result.data then
            for _, server in ipairs(result.data) do
                if server.playing < server.maxPlayers and server.id ~= JobId then
                    foundServer = server.id
                    break
                end
            end

            if foundServer then
                break
            end

            if result.nextPageCursor then
                cursor = result.nextPageCursor
            else
                break
            end
        else
            break
        end
    end

    return foundServer
end

-- Function to hop servers
local function serverHop()
    local serverId = findNewServer()
    if serverId then
        TeleportService:TeleportToPlaceInstance(PlaceId, serverId, LocalPlayer)
    else
        warn("No new server found!")
    end
end

-- Wait 20 minutes then hop
while task.wait(20 * 60) do
    serverHop()
end
