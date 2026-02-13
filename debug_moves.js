
async function checkMoves() {
    try {
        console.log("Fetching Psychic moves...");
        const tRes = await fetch("https://pokeapi.co/api/v2/type/psychic");
        const tData = await tRes.json();
        const typeMoves = new Set(tData.moves.map(m => m.name));
        console.log(`Psychic moves count: ${typeMoves.size}`);

        console.log("Fetching Physical moves...");
        const cRes = await fetch("https://pokeapi.co/api/v2/move-damage-class/physical");
        const cData = await cRes.json();
        const catMoves = new Set(cData.moves.map(m => m.name));
        console.log(`Physical moves count: ${catMoves.size}`);

        // Intersection
        const intersection = [...typeMoves].filter(x => catMoves.has(x));
        console.log(`Intersection (Psychic + Physical): ${intersection.length}`);
        console.log("Moves:", intersection);
    } catch (e) {
        console.error(e);
    }
}

checkMoves();
