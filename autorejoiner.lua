--// Auto Server Hop every 20 minutes with Countdown //--

local Players = game:GetService("Players")
local TeleportService = game:GetService("TeleportService")
local HttpService = game:GetService("HttpService")
local RunService = game:GetService("RunService")

local player = Players.LocalPlayer
local placeId = game.PlaceId

-- Time (20 minutes)
local HOP_INTERVAL = 1200
local timeLeft = HOP_INTERVAL

-- UI
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Parent = game:GetService("CoreGui")
ScreenGui.ResetOnSpawn = false

local CountdownLabel = Instance.new("TextLabel")
CountdownLabel.Parent = ScreenGui
CountdownLabel.Size = UDim2.new(0, 300, 0, 50)
CountdownLabel.Position = UDim2.new(0.5, -150, 0, 20)
CountdownLabel.BackgroundTransparency = 0.3
CountdownLabel.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
CountdownLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
CountdownLabel.Font = Enum.Font.SourceSansBold
CountdownLabel.TextScaled = true

local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 12)
corner.Parent = CountdownLabel

-- Function to get a different server
local function findServer()
    local servers = {}
    local cursor = ""
    repeat
        local url = string.format(
            "https://games.roblox.com/v1/games/%d/servers/Public?sortOrder=Asc&limit=100%s",
            placeId,
            cursor ~= "" and "&cursor=" .. cursor or ""
        )
        local success, result = pcall(function()
            return HttpService:JSONDecode(game:HttpGet(url))
        end)
        if success and result and result.data then
            for _, server in ipairs(result.data) do
                if server.playing < server.maxPlayers and server.id ~= game.JobId then
                    table.insert(servers, server.id)
                end
            end
            cursor = result.nextPageCursor or ""
        else
            break
        end
    until cursor == "" or #servers >= 5
    return #servers > 0 and servers[math.random(1, #servers)] or nil
end

-- Auto hop
task.spawn(function()
    while true do
        task.wait(HOP_INTERVAL)
        local serverId = findServer()
        if serverId then
            TeleportService:TeleportToPlaceInstance(placeId, serverId, player)
        else
            TeleportService:Teleport(placeId, player)
        end
    end
end)

-- Countdown update
RunService.RenderStepped:Connect(function(dt)
    timeLeft -= dt
    if timeLeft <= 0 then
        timeLeft = HOP_INTERVAL
    end
    local mins = math.floor(timeLeft / 60)
    local secs = math.floor(timeLeft % 60)
    CountdownLabel.Text = string.format("Server hop in: %02d:%02d", mins, secs)
end)
