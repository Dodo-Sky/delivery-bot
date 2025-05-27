"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataFromServer = void 0;
exports.postDataServer = postDataServer;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const getEnv = (name) => {
    if (!process.env[name]) {
        throw new Error('Не найдена переменная окружения ' + name);
    }
    return process.env[name];
};
const URL = getEnv('API_BASE_URL');
const getDataFromServer = (variable) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${URL}globalGetServer?payload=${variable}`;
    const response = yield fetch(url);
    try {
        const data = yield response.json();
        return data;
    }
    catch (error) {
        return 'Произошла ошибка при получении данных';
    }
});
exports.getDataFromServer = getDataFromServer;
function postDataServer(variableName, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `${URL}${variableName}`;
            const response = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            let data = yield response.json();
            if (response.ok) {
                return data;
            }
            else {
                const responseData = yield response.text();
                alert('Ошибка обратитесь к администратору ' + responseData);
            }
        }
        catch (error) {
            return 'Произошла ошибка при передаче данных';
        }
    });
}
