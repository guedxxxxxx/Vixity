--// Auto Reset + Auto Rejoin with Side-to-Side RGB Gradient Countdown GUI + Buttons //--

local Players = game:GetService("Players")
local TeleportService = game:GetService("TeleportService")
local RunService = game:GetService("RunService")

local player = Players.LocalPlayer
local placeId = game.PlaceId

-- GUI Setup
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Parent = game:GetService("CoreGui")
ScreenGui.ResetOnSpawn = false

-- Countdown Label
local TextLabel = Instance.new("TextLabel")
TextLabel.Parent = ScreenGui
TextLabel.BackgroundTransparency = 1
TextLabel.Size = UDim2.new(0, 350, 0, 70)
TextLabel.Position = UDim2.new(0, 10, 0, 10)
TextLabel.TextScaled = true
TextLabel.Font = Enum.Font.SourceSansBold
TextLabel.TextStrokeTransparency = 0.5
TextLabel.RichText = true

-- Buttons
local function createButton(name, position, callback)
    local btn = Instance.new("TextButton")
    btn.Parent = ScreenGui
    btn.Size = UDim2.new(0, 150, 0, 50)
    btn.Position = position
    btn.Text = name
    btn.Font = Enum.Font.SourceSansBold
    btn.TextScaled = true
    btn.BackgroundColor3 = Color3.fromRGB(50, 50, 50)
    btn.TextColor3 = Color3.fromRGB(255, 255, 255)
    btn.BorderSizePixel = 0
    btn.MouseButton1Click:Connect(callback)
    return btn
end

local resetButton = createButton("Reset now", UDim2.new(0, 10, 0, 90), function()
    if player.Character then
        player.Character:BreakJoints()
    end
end)

local rejoinButton = createButton("Rejoin now", UDim2.new(0, 170, 0, 90), function()
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

-- Side-to-side RGB gradient animation
local hueOffset = 0
RunService.RenderStepped:Connect(function(dt)
    hueOffset = (hueOffset + dt * 1.5) % 1 -- higher multiplier = faster sideways slide
    local message = string.format(
        "Reset in: %ds | Rejoin in: %ds | made by Guedx_zs",
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

    TextLabel.Text = table.concat(out)
end)
