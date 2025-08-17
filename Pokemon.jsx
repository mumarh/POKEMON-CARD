import { useEffect, useState } from "react";
import "./Pokemon.css";

export const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const API = "https://pokeapi.co/api/v2/pokemon?limit=300";

  const fetchPokemon = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();

      const detailedPokemonData = data.results.map(async (Poke) => {
        const res = await fetch(Poke.url);
        const data = await res.json();
        return data;
      });

      const detailedResponses = await Promise.all(detailedPokemonData);
      setPokemon(detailedResponses);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  const searchData = pokemon.filter((Poke) =>
    Poke.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <h1>Loading....</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>{error.message}</h1>
      </div>
    );
  }

  return (
    <>
      <section className="container">
        <header>
          <h1> Lets Catch Pokémon</h1>
        </header>
        <div className="pokemon-search">
          <input
            type="text"
            placeholder="search Pokemon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <ul className="cards">
            {searchData.map((pokemonData) => (
              <li className="pokemon-card" key={pokemonData.id}>
                <figure>
                  <img
                    src={
                      pokemonData.sprites.other.dream_world.front_default ||
                      pokemonData.sprites.front_default
                    }
                    alt={pokemonData.name}
                    className="pokemon-image"
                  />
                </figure>
                <h1 className="pokemon-name">{pokemonData.name}</h1>
                <div className="pokemon-info pokemon-highlight">
                  <p>
                    {pokemonData.types
                      .map((curType) => curType.type.name)
                      .join(", ")}
                  </p>
                </div>

                <div className="grid-three-cols">
                  <p className="pokemon-info">
                    <span>Height:</span> {pokemonData.height}
                  </p>
                  <p className="pokemon-info">
                    <span>Weight:</span> {pokemonData.weight}
                  </p>
                  <p className="pokemon-info">
                    <span>Speed:</span>{" "}
                    {pokemonData.stats[5]?.base_stat ?? "N/A"}
                  </p>
                </div>

                <div className="grid-three-cols">
                  <div className="pokemon-info">
                    <p>{pokemonData.base_experience}</p>
                    <span>Experience:</span>
                  </div>
                  <div className="pokemon-info">
                    <p>{pokemonData.stats[1]?.base_stat ?? "N/A"}</p>
                    <span>Attack:</span>
                  </div>
                  <div className="pokemon-info">
                    <p>
                      {pokemonData.abilities
                        .map((abilityInfo) => abilityInfo.ability.name)
                        .slice(0, 1)
                        .join(", ")}
                    </p>
                    <span>Abilities:</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};
