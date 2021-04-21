// Short declarations for brevity
export interface PokemonType {
    name: string,
    damage_relations: {
        double_damage_from: [PokemonTypeRel],
        double_damage_to: [PokemonTypeRel],
        half_damage_from: [PokemonTypeRel],
        half_damage_to: [PokemonTypeRel],
        no_damage_from: [PokemonTypeRel],
        no_damage_to: [PokemonTypeRel]
    }
}
export interface PokemonTypeRel {
    name: string,
    url: string
}
export interface Pokemon {
    types: [{type: PokemonTypeRel}]
}