--// Auto Rejoin with Rounded Grey UI, Gradient & Draggable Frame //--

local Players = game:GetService("Players")
local TeleportService = game:GetService("TeleportService")
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")

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

-- Draggable function
local dragging, dragInput, dragStart, startPos

local function update(input)
    local delta = input.Position - dragStart
    MainFrame.Position = UDim2.new(
        startPos.X.Scale,
        startPos.X.Offset + delta.X,
        startPos.Y.Scale,
        startPos.Y.Offset + delta.Y
    )
end

MainFrame.InputBegan:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1 or
       input.UserInputType == Enum.UserInputType.Touch then
        dragging = true
        dragStart = input.Position
        startPos = MainFrame.Position

        input.Changed:Connect(function()
            if input.UserInputState == Enum.UserInputState.End then
                dragging = false
            end
        end)
    end
end)

MainFrame.InputChanged:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseMovement or
       input.UserInputType == Enum.UserInputType.Touch then
        dragInput = input
    end
end)

UserInputService.InputChanged:Connect(function(input)
    if input == dragInput and dragging then
        update(input)
    end
end)

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

-- Rejoin Button
local rejoinButton = Instance.new("TextButton")
rejoinButton.Parent = MainFrame
rejoinButton.Size = UDim2.new(0, 100, 0, 35)
rejoinButton.Position = UDim2.new(0, 100, 0, 85)
rejoinButton.Text = "Rejoin"
rejoinButton.Font = Enum.Font.SourceSansBold
rejoinButton.TextScaled = true
rejoinButton.BackgroundColor3 = Color3.fromRGB(40, 40, 40)
rejoinButton.TextColor3 = Color3.fromRGB(255, 255, 255)
rejoinButton.BorderSizePixel = 0

local corner = Instance.new("UICorner")
corner.CornerRadius = UDim.new(0, 8)
corner.Parent = rejoinButton

rejoinButton.MouseButton1Click:Connect(function()
    TeleportService:Teleport(placeId, player)
end)

-- Timer
local REJOIN_INTERVAL = 3600
local rejoinTimeLeft = REJOIN_INTERVAL

task.spawn(function()
    while true do
        task.wait(REJOIN_INTERVAL)
        TeleportService:Teleport(placeId, player)
    end
end)

-- Gradient animation for countdown
local hueOffset = 0
RunService.RenderStepped:Connect(function(dt)
    hueOffset = (hueOffset + dt * 0.3) % 1
    local message = string.format("Rejoin in: %ds", rejoinTimeLeft)
    rejoinTimeLeft -= dt
    if rejoinTimeLeft < 0 then rejoinTimeLeft = REJOIN_INTERVAL end

    local out = {}
    local length = #message
    for i = 1, length do
        local char = message:sub(i, i)
        local brightness = math.abs(math.sin((hueOffset + i/length) * math.pi))
        local gray = math.floor(brightness * 255)
        table.insert(out,
            string.format('<font color="#%02X%02X%02X">%s</font>',
                gray, gray, gray, char)
        )
    end

    CountdownLabel.Text = table.concat(out)
end)
