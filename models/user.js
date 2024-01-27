"use strict";
exports.__esModule = true;
exports.userSchema = void 0;
var mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true },
    isHost: { type: Boolean, required: true, "default": false },
    imgUrl: { type: String }
});
var UserModel = mongoose_1["default"].models.LobbyUser || mongoose_1["default"].model("LobbyUser", exports.userSchema);
exports["default"] = UserModel;
