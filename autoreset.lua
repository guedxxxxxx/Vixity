--// Auto Reset with Countdown GUI //--

local Players = game:GetService("Players")
local player = Players.LocalPlayer

-- GUI Setup
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Parent = game:GetService("CoreGui")
ScreenGui.ResetOnSpawn = false

local TextLabel = Instance.new("TextLabel")
TextLabel.Parent = ScreenGui
TextLabel.BackgroundTransparency = 1
TextLabel.Size = UDim2.new(0, 200, 0, 50)
TextLabel.Position = UDim2.new(0, 10, 0, 10)
TextLabel.TextColor3 = Color3.fromRGB(255, 0, 0)
TextLabel.TextScaled = true
TextLabel.Font = Enum.Font.SourceSansBold

local RESET_INTERVAL = 1200 -- 20 minutes in seconds
local timeLeft = RESET_INTERVAL

-- Update GUI every second
spawn(function()
    while true do
        TextLabel.Text = "Time until next reset: "..timeLeft.."s\nmade by Guedx_zs"
        task.wait(1)
        timeLeft = timeLeft - 1
        if timeLeft <= 0 then
            timeLeft = RESET_INTERVAL -- reset counter after reset
        end
    end
end)

-- Auto Reset Loop
spawn(function()
    while true do
        task.wait(RESET_INTERVAL)
        if player.Character then
            player.Character:BreakJoints() -- resets character
        end
    end
end)
