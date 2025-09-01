--// Auto Reset + Auto Rejoin with Animated RGB Countdown GUI //--

local Players = game:GetService("Players")
local TeleportService = game:GetService("TeleportService")
local RunService = game:GetService("RunService")
local player = Players.LocalPlayer
local placeId = game.PlaceId

-- GUI Setup
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Parent = game:GetService("CoreGui")
ScreenGui.ResetOnSpawn = false

local TextLabel = Instance.new("TextLabel")
TextLabel.Parent = ScreenGui
TextLabel.BackgroundTransparency = 1
TextLabel.Size = UDim2.new(0, 300, 0, 70)
TextLabel.Position = UDim2.new(0, 10, 0, 10)
TextLabel.TextScaled = true
TextLabel.Font = Enum.Font.SourceSansBold
TextLabel.TextStrokeTransparency = 0.5

-- Timers
local RESET_INTERVAL = 1200  -- 20 minutes
local REJOIN_INTERVAL = 3600 -- 1 hour
local resetTimeLeft = RESET_INTERVAL
local rejoinTimeLeft = REJOIN_INTERVAL

-- Countdown updater
spawn(function()
    while true do
        task.wait(1)
        resetTimeLeft = resetTimeLeft - 1
        rejoinTimeLeft = rejoinTimeLeft - 1

        if resetTimeLeft <= 0 then
            resetTimeLeft = RESET_INTERVAL
        end
        if rejoinTimeLeft <= 0 then
            rejoinTimeLeft = REJOIN_INTERVAL
        end
    end
end)

-- Auto Reset Loop
spawn(function()
    while true do
        task.wait(RESET_INTERVAL)
        if player.Character then
            player.Character:BreakJoints()
        end
    end
end)

-- Auto Rejoin Loop
spawn(function()
    while true do
        task.wait(REJOIN_INTERVAL)
        TeleportService:Teleport(placeId, player)
    end
end)

-- RGB Animation (true rainbow)
local hue = 0
RunService.RenderStepped:Connect(function(deltaTime)
    hue = (hue + deltaTime * 0.5) % 1 -- adjust speed here
    local color = Color3.fromHSV(hue, 1, 1)
    TextLabel.TextColor3 = color
    TextLabel.Text = "Reset in: "..resetTimeLeft.."s\nRejoin in: "..rejoinTimeLeft.."s\nmade by Guedx_zs"
end)
