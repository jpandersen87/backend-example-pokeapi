"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const yargs_1 = __importDefault(require("yargs"));
const POKE_API = 'https://pokeapi.co/api/v2';
// Using standard HTTP GET calls for dependency simplicity, 
// but could also use a third-party wrapper library if available
function getPokemon(pokemon) {
    return __awaiter(this, void 0, void 0, function* () {
        return axios_1.default.get(`${POKE_API}/pokemon/${pokemon}`);
    });
}
const options = yargs_1.default
    .usage("Usage: -n <pokemon name>")
    .option("n", { alias: "name", type: "string", demandOption: true })
    .argv;
function run() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pokeData = (yield getPokemon(options.n)).data;
            // Asynchronously GET all pokemon type data, return only the json to array
            const pokeTypeData = (yield Promise.all(pokeData.types.map(x => axios_1.default.get(x.type.url))))
                .map(x => x.data);
            console.log(`${options.n} - ${pokeTypeData.map(x => x.name).join(" / ")}\n`);
            for (var pokeType of pokeTypeData) {
                console.log(`${pokeType.name} type`);
                console.log(`Double Damage To: ${pokeType.damage_relations.double_damage_to.map(x => x.name).join(", ")}`);
                console.log(`Double Damage From: ${pokeType.damage_relations.double_damage_from.map(x => x.name).join(", ")}`);
                console.log(`Half Damage To: ${pokeType.damage_relations.half_damage_to.map(x => x.name).join(", ")}`);
                console.log(`Half Damage From: ${pokeType.damage_relations.half_damage_from.map(x => x.name).join(", ")}`);
                console.log(`No Damage To: ${pokeType.damage_relations.no_damage_to.map(x => x.name).join(", ")}`);
                console.log(`No Damage From: ${pokeType.damage_relations.double_damage_from.map(x => x.name).join(", ")}\n`);
            }
        }
        catch (e) {
            if (e.response || e.request) {
                if (((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                    console.log(`The pokemon "${options.n}" was not found. Please try again.`);
                }
                else {
                    console.log("An error occured communicating with pokeapi, please try again later.");
                }
            }
            else {
                console.error(e);
            }
        }
    });
}
run();
//# sourceMappingURL=index.js.map