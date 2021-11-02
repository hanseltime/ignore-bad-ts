"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ignoreFiles = exports.ignoreFilesSync = void 0;
var fs_1 = require("fs");
var fast_glob_1 = __importDefault(require("fast-glob"));
var tsExtensionsRegex = /\.tsx?/i;
var tsNoCheckRegex = /^\s*\/\/\s*@ts-nocheck/i;
function isTSFile(filePath) {
    return filePath.match(tsExtensionsRegex);
}
function tsDebug(filePath, options) {
    if (options === null || options === void 0 ? void 0 : options.debugTS) {
        console.debug("TS No-Check Match: " + filePath);
    }
}
function globDebug(filePath, options) {
    if (options === null || options === void 0 ? void 0 : options.debugGlob) {
        console.debug("Glob Match: " + filePath);
    }
}
function tryAddIgnoreToFileSync(filePath, options) {
    if (isTSFile(filePath)) {
        tsDebug(filePath, options);
        var file = (0, fs_1.readFileSync)(filePath, { encoding: 'utf8' });
        if (!file.match(tsNoCheckRegex)) {
            console.log("Writing @ts-nocheck to file " + filePath);
            (0, fs_1.writeFileSync)(filePath, "// @ts-nocheck\n// ^ Above line was added by ignore-bad-ts\n" + file);
        }
    }
}
function tryAddIgnoreToFile(filePath, options) {
    return __awaiter(this, void 0, void 0, function () {
        var filePromise, file_1, writePromise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isTSFile(filePath)) return [3 /*break*/, 2];
                    tsDebug(filePath, options);
                    filePromise = new Promise(function (resolve, reject) {
                        (0, fs_1.readFile)(filePath, function (err, data) {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(data.toString('utf-8'));
                            }
                        });
                    });
                    return [4 /*yield*/, filePromise];
                case 1:
                    file_1 = _a.sent();
                    if (!file_1.match(tsNoCheckRegex)) {
                        console.log("Writing @ts-nocheck to file " + filePath);
                        writePromise = new Promise(function (resolve, reject) {
                            (0, fs_1.writeFile)(filePath, "// @ts-nocheck\n// ^ Above line was added by ignore-bad-ts\n" + file_1, function (err) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve();
                                }
                            });
                        });
                        return [2 /*return*/, writePromise];
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/, Promise.resolve()];
            }
        });
    });
}
var globOptions = {
    onlyFiles: true,
    absolute: true,
};
var defaultOptions = {
    cwd: './',
};
function ignoreFilesSync(fileGlobs, options) {
    if (options === void 0) { options = {}; }
    var filePaths = fast_glob_1.default.sync(fileGlobs, __assign(__assign(__assign({}, defaultOptions), options), globOptions));
    filePaths.forEach(function (filePath) {
        globDebug(filePath, options);
        tryAddIgnoreToFileSync(filePath, options);
    });
}
exports.ignoreFilesSync = ignoreFilesSync;
function ignoreFiles(fileGlobs, options) {
    var e_1, _a;
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var filePathsStream, writePromises, filePathsStream_1, filePathsStream_1_1, filePath, e_1_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    filePathsStream = fast_glob_1.default.stream(fileGlobs, __assign(__assign(__assign({}, defaultOptions), options), globOptions));
                    writePromises = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    filePathsStream_1 = __asyncValues(filePathsStream);
                    _b.label = 2;
                case 2: return [4 /*yield*/, filePathsStream_1.next()];
                case 3:
                    if (!(filePathsStream_1_1 = _b.sent(), !filePathsStream_1_1.done)) return [3 /*break*/, 5];
                    filePath = filePathsStream_1_1.value;
                    globDebug(filePath, options);
                    writePromises.push(tryAddIgnoreToFile(Buffer.isBuffer(filePath) ? filePath.toString('utf-8') : filePath, options));
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(filePathsStream_1_1 && !filePathsStream_1_1.done && (_a = filePathsStream_1.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(filePathsStream_1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [4 /*yield*/, Promise.all(writePromises)];
                case 13:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.ignoreFiles = ignoreFiles;
