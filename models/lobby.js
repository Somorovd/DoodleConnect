"use strict";
exports.__esModule = true;
exports.lobbySchema = void 0;
var mongoose_1 = require("mongoose");
var user_1 = require("./user");
exports.lobbySchema = new mongoose_1.Schema({
    inviteCode: { type: String, required: true },
    users: { type: [user_1.userSchema], required: true, "default": [] },
    maxUsers: { type: Number, required: true, "default": 8, min: 1, max: 8 }
});
var LobbyModel = mongoose_1["default"].models.Lobby || mongoose_1["default"].model("Lobby", exports.lobbySchema);
exports["default"] = LobbyModel;
