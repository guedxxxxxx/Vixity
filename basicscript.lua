--// Auto Reset + Auto Rejoin with Rounded Grey UI and Black & White Gradient //--

local Players = game:GetService("Players")
local TeleportService = game:GetService("TeleportService")
local RunService = game:GetService("RunService")

local player = Players.LocalPlayer
local placeId = game.PlaceId

-- GUI Setup
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Parent = game:GetService("CoreGui")
ScreenGui.ResetOnSpawn = false

-- Main Frame
local MainFrame = Instance.new("Frame")
MainFrame.Parent = ScreenGui
MainFrame.Size = UDim2.new(0, 300, 0, 130)
MainFrame.Position = UDim2.new(0, 20, 0, 20)
MainFrame.BackgroundColor3 = Color3.fromRGB(50, 50, 50)
MainFrame.BorderSizePixel = 0

-- Rounded corners
local UICorner = Instance.new("UICorner")
UICorner.CornerRadius = UDim.new(0, 15)
UICorner.Parent = MainFrame

-- Countdown Label
local CountdownLabel = Instance.new("TextLabel")
CountdownLabel.Parent = MainFrame
CountdownLabel.BackgroundTransparency = 1
CountdownLabel.Size = UDim2.new(1, 0, 0, 40)
CountdownLabel.Position = UDim2.new(0, 0, 0, 10)
CountdownLabel.TextScaled = true
CountdownLabel.Font = Enum.Font.SourceSansBold
CountdownLabel.TextStrokeTransparency = 0.5
CountdownLabel.RichText = true
CountdownLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
CountdownLabel.TextXAlignment = Enum.TextXAlignment.Center

-- Credit Label
local CreditLabel = Instance.new("TextLabel")
CreditLabel.Parent = MainFrame
CreditLabel.BackgroundTransparency = 1
CreditLabel.Size = UDim2.new(1, 0, 0, 20)
CreditLabel.Position = UDim2.new(0, 0, 0, 55)
CreditLabel.TextScaled = true
CreditLabel.Font = Enum.Font.SourceSansBold
CreditLabel.TextStrokeTransparency = 0.5
CreditLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
CreditLabel.Text = "Made by Guedx_zs"
CreditLabel.TextXAlignment = Enum.TextXAlignment.Center

-- Buttons
local function createButton(name, positionX, callback)
    local btn = Instance.new("TextButton")
    btn.Parent = MainFrame
    btn.Size = UDim2.new(0, 100, 0, 35)
    btn.Position = UDim2.new(0, positionX, 0, 85)
    btn.Text = name
    btn.Font = Enum.Font.SourceSansBold
    btn.TextScaled = true
    btn.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
    btn.TextColor3 = Color3.fromRGB(255, 255, 255)
    btn.BorderSizePixel = 0

    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 8)
    corner.Parent = btn

    btn.MouseButton1Click:Connect(callback)
    return btn
end

local resetButton = createButton("Reset", 20, function()
    if player.Character then
        player.Character:BreakJoints()
    end
end)

local rejoinButton = createButton("Rejoin", 180, function()
    TeleportService:Teleport(placeId, player)
end)

-- Timers
local RESET_INTERVAL = 1200
local REJOIN_INTERVAL = 3600
local resetTimeLeft = RESET_INTERVAL
local rejoinTimeLeft = REJOIN_INTERVAL

task.spawn(function()
    while true do
        task.wait(1)
        resetTimeLeft -= 1
        rejoinTimeLeft -= 1
        if resetTimeLeft <= 0 then resetTimeLeft = RESET_INTERVAL end
        if rejoinTimeLeft <= 0 then rejoinTimeLeft = REJOIN_INTERVAL end
    end
end)

task.spawn(function()
    while true do
        task.wait(RESET_INTERVAL)
        if player.Character then
            player.Character:BreakJoints()
        end
    end
end)

task.spawn(function()
    while true do
        task.wait(REJOIN_INTERVAL)
        TeleportService:Teleport(placeId, player)
    end
end)

-- Black & White gradient animation (slow)
local hueOffset = 0
RunService.RenderStepped:Connect(function(dt)
    hueOffset = (hueOffset + dt * 0.3) % 1 -- slower animation
    local message = string.format(
        "Reset in: %ds | Rejoin in: %ds",
        resetTimeLeft, rejoinTimeLeft
    )

    local out = {}
    local length = #message
    for i = 1, length do
        local char = message:sub(i, i)
        local brightness = math.abs(math.sin((hueOffset + i/length) * math.pi)) -- 0 to 1 wave
        local gray = math.floor(brightness * 255)
        table.insert(out,
            string.format('<font color="#%02X%02X%02X">%s</font>',
                gray, gray, gray, char)
        )
    end

    CountdownLabel.Text = table.concat(out)
end)
