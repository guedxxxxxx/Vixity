--// Auto Reset + Auto Rejoin with Compact RGB Countdown GUI + Buttons //--

local Players = game:GetService("Players")
local TeleportService = game:GetService("TeleportService")
local RunService = game:GetService("RunService")

local player = Players.LocalPlayer
local placeId = game.PlaceId

-- GUI Setup
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Parent = game:GetService("CoreGui")
ScreenGui.ResetOnSpawn = false

-- Countdown Label (Top line)
local CountdownLabel = Instance.new("TextLabel")
CountdownLabel.Parent = ScreenGui
CountdownLabel.BackgroundTransparency = 1
CountdownLabel.Size = UDim2.new(0, 320, 0, 30)
CountdownLabel.Position = UDim2.new(0, 10, 0, 10)
CountdownLabel.TextScaled = true
CountdownLabel.Font = Enum.Font.SourceSansBold
CountdownLabel.TextStrokeTransparency = 0.5
CountdownLabel.RichText = true
CountdownLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
CountdownLabel.TextXAlignment = Enum.TextXAlignment.Left

-- Made by label (second line)
local CreditLabel = Instance.new("TextLabel")
CreditLabel.Parent = ScreenGui
CreditLabel.BackgroundTransparency = 1
CreditLabel.Size = UDim2.new(0, 300, 0, 20)
CreditLabel.Position = UDim2.new(0, 10, 0, 45)
CreditLabel.TextScaled = true
CreditLabel.Font = Enum.Font.SourceSans
CreditLabel.Text = "Made by Guedx_zs"
CreditLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
CreditLabel.TextXAlignment = Enum.TextXAlignment.Left

-- Buttons
local function createButton(name, positionX, callback)
    local btn = Instance.new("TextButton")
    btn.Parent = ScreenGui
    btn.Size = UDim2.new(0, 90, 0, 35)
    btn.Position = UDim2.new(0, positionX, 0, 75)
    btn.Text = name
    btn.Font = Enum.Font.SourceSansBold
    btn.TextScaled = true
    btn.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
    btn.TextColor3 = Color3.fromRGB(255, 255, 255)
    btn.BorderSizePixel = 0

    -- Hover effect
    btn.MouseEnter:Connect(function()
        btn.BackgroundColor3 = Color3.fromRGB(70, 70, 70)
    end)
    btn.MouseLeave:Connect(function()
        btn.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
    end)

    btn.MouseButton1Click:Connect(callback)
    return btn
end

local resetButton = createButton("Reset", 10, function()
    if player.Character then
        player.Character:BreakJoints()
    end
end)

local rejoinButton = createButton("Rejoin", 110, function()
    TeleportService:Teleport(placeId, player)
end)

-- Timers
local RESET_INTERVAL = 1200  -- 20 minutes
local REJOIN_INTERVAL = 3600 -- 1 hour
local resetTimeLeft = RESET_INTERVAL
local rejoinTimeLeft = REJOIN_INTERVAL

-- Countdown updater
task.spawn(function()
    while true do
        task.wait(1)
        resetTimeLeft -= 1
        rejoinTimeLeft -= 1
        if resetTimeLeft <= 0 then resetTimeLeft = RESET_INTERVAL end
        if rejoinTimeLeft <= 0 then rejoinTimeLeft = REJOIN_INTERVAL end
    end
end)

-- Auto Reset
task.spawn(function()
    while true do
        task.wait(RESET_INTERVAL)
        if player.Character then
            player.Character:BreakJoints()
        end
    end
end)

-- Auto Rejoin
task.spawn(function()
    while true do
        task.wait(REJOIN_INTERVAL)
        TeleportService:Teleport(placeId, player)
    end
end)

-- Side-to-side RGB gradient animation for countdown text
local hueOffset = 0
RunService.RenderStepped:Connect(function(dt)
    hueOffset = (hueOffset + dt * 1.5) % 1
    local message = string.format(
        "Reset in: %ds | Rejoin in: %ds",
        resetTimeLeft, rejoinTimeLeft
    )

    local out = {}
    local length = #message
    for i = 1, length do
        local char = message:sub(i, i)
        local hue = (hueOffset + (i / length)) % 1
        local color = Color3.fromHSV(hue, 1, 1)
        table.insert(out,
            string.format('<font color="#%02X%02X%02X">%s</font>',
                color.R * 255, color.G * 255, color.B * 255, char)
        )
    end

    CountdownLabel.Text = table.concat(out)
end)
