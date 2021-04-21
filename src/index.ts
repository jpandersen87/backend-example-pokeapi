import axios from 'axios';
import yargs from 'yargs';
import { Pokemon, PokemonType } from './pokemon';

const POKE_API = 'https://pokeapi.co/api/v2';

// Using standard HTTP GET calls for dependency simplicity, 
// but could also use a third-party wrapper library if available
async function getPokemon(pokemon:string){
    return axios.get(`${POKE_API}/pokemon/${pokemon}`);
}

const options = yargs
    .usage("Usage: -n <pokemon name>")
    .option("n", {alias: "name", type: "string", demandOption: true})
    .argv;

async function run(){
    try {
        const pokeData:Pokemon = (await getPokemon(options.n)).data;

        // Asynchronously GET all pokemon type data, return only the json to array
        const pokeTypeData: PokemonType[] = (await Promise.all(pokeData.types.map(x => axios.get(x.type.url))))
            .map(x => x.data);

        console.log(`${options.n} - ${pokeTypeData.map(x => x.name).join(" / ")}\n`)

        for(var pokeType of pokeTypeData){
            console.log(`${pokeType.name} type`);
            console.log(`Double Damage To: ${pokeType.damage_relations.double_damage_to.map(x=>x.name).join(", ")}`);
            console.log(`Double Damage From: ${pokeType.damage_relations.double_damage_from.map(x=>x.name).join(", ")}`);
            console.log(`Half Damage To: ${pokeType.damage_relations.half_damage_to.map(x=>x.name).join(", ")}`);
            console.log(`Half Damage From: ${pokeType.damage_relations.half_damage_from.map(x=>x.name).join(", ")}`);
            console.log(`No Damage To: ${pokeType.damage_relations.no_damage_to.map(x=>x.name).join(", ")}`);
            console.log(`No Damage From: ${pokeType.damage_relations.double_damage_from.map(x=>x.name).join(", ")}\n`);
        }
    } catch(e){
        if(e.response || e.request){
            if(e.response?.status === 404){
                console.log(`The pokemon "${options.n}" was not found. Please try again.`);
            } else {
                console.log("An error occured communicating with pokeapi, please try again later.");
            }
        } else {
            console.error(e);
        }
    }
}

run();