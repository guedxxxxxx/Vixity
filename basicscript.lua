--// Auto Reset + Auto Rejoin with Gradient RGB Text UI //--

local Players = game:GetService("Players")
local TeleportService = game:GetService("TeleportService")
local RunService = game:GetService("RunService")
local player = Players.LocalPlayer
local placeId = game.PlaceId

-- Timers
local RESET_INTERVAL = 1200  -- 20 minutes
local REJOIN_INTERVAL = 3600 -- 1 hour
local resetTimeLeft = RESET_INTERVAL
local rejoinTimeLeft = REJOIN_INTERVAL

-- GUI Setup
local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Parent = game:GetService("CoreGui")
ScreenGui.ResetOnSpawn = false

local Frame = Instance.new("Frame")
Frame.Parent = ScreenGui
Frame.Size = UDim2.new(0, 320, 0, 70)
Frame.Position = UDim2.new(0, 10, 0, 10)
Frame.BackgroundColor3 = Color3.fromRGB(30,30,40)
Frame.BackgroundTransparency = 0
Frame.BorderSizePixel = 0
Frame.ClipsDescendants = true
Frame.AnchorPoint = Vector2.new(0,0)
Frame.ZIndex = 2

-- Rounded corners
local UICorner = Instance.new("UICorner")
UICorner.CornerRadius = UDim.new(0, 12)
UICorner.Parent = Frame

-- TextLabel
local TextLabel = Instance.new("TextLabel")
TextLabel.Parent = Frame
TextLabel.BackgroundTransparency = 1
TextLabel.Size = UDim2.new(1, -20, 1, -20)
TextLabel.Position = UDim2.new(0, 10, 0, 10)
TextLabel.TextScaled = true
TextLabel.Font = Enum.Font.SourceSansBold
TextLabel.TextXAlignment = Enum.TextXAlignment.Left
TextLabel.TextYAlignment = Enum.TextYAlignment.Center

-- Update timers
spawn(function()
    while true do
        task.wait(1)
        resetTimeLeft = resetTimeLeft - 1
        rejoinTimeLeft = rejoinTimeLeft - 1
        if resetTimeLeft <= 0 then resetTimeLeft = RESET_INTERVAL end
        if rejoinTimeLeft <= 0 then rejoinTimeLeft = REJOIN_INTERVAL end
    end
end)

-- Auto Reset
spawn(function()
    while true do
        task.wait(RESET_INTERVAL)
        if player.Character then
            player.Character:BreakJoints()
        end
    end
end)

-- Auto Rejoin
spawn(function()
    while true do
        task.wait(REJOIN_INTERVAL)
        TeleportService:Teleport(placeId, player)
    end
end)

-- Gradient RGB animation
local hueOffset = 0
RunService.RenderStepped:Connect(function(dt)
    hueOffset = (hueOffset + dt*0.25) % 1  -- speed of the gradient movement
    local message = "Reset in: "..resetTimeLeft.."s | Rejoin in: "..rejoinTimeLeft.."s | made by Guedx_zs"

    local coloredText = ""
    for i = 1, #message do
        local char = message:sub(i,i)
        local hue = (hueOffset + i/#message) % 1
        local color = Color3.fromHSV(hue,1,1)
        local hex = string.format("%02X%02X%02X", math.floor(color.R*255), math.floor(color.G*255), math.floor(color.B*255))
        coloredText = coloredText..'<font color="#'..hex..'">'..char..'</font>'
    end

    TextLabel.Text = coloredText
    TextLabel.RichText = true
end)
