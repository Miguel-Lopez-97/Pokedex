import React from 'react';
import { typeColors } from "../Api_Gen/Home";

// Type Effectiveness Matrix
// Rows: Attackers, Cols: Defenders
// 0: Normal, 1: Fire, 2: Water, 3: Electric, 4: Grass, 5: Ice, 6: Fighting, 7: Poison, 8: Ground, 9: Flying, 10: Psychic, 11: Bug, 12: Rock, 13: Ghost, 14: Dragon, 15: Steel, 16: Fairy, 17: Dark
// Order matches the TYPES array below

const TYPES = [
    "Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground",
    "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Steel", "Fairy", "Dark"
];

// 2D Array for Effectiveness: [Attacker][Defender]
// Values: 0 (Immune), 0.5 (Not very effective), 1 (Normal), 2 (Super effective)
const TYPE_CHART = [
    // DEFENDER ->
    // Nor Fir Wat Ele Gra Ice Fig Poi Gro Fly Psy Bug Roc Gho Dra Ste Fai Dar
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 0, 1, 0.5, 1, 1], // Normal Attack
    [1, 0.5, 0.5, 1, 2, 2, 1, 1, 1, 1, 1, 2, 0.5, 1, 0.5, 2, 1, 1], // Fire Attack
    [1, 2, 0.5, 1, 0.5, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0.5, 1, 1, 1], // Water Attack
    [1, 1, 2, 0.5, 0.5, 1, 1, 1, 0, 2, 1, 1, 1, 1, 0.5, 1, 1, 1], // Electric Attack
    [1, 0.5, 2, 1, 0.5, 1, 1, 0.5, 2, 0.5, 1, 0.5, 2, 1, 0.5, 0.5, 1, 1], // Grass Attack
    [1, 0.5, 0.5, 1, 2, 0.5, 1, 1, 2, 2, 1, 1, 1, 1, 2, 0.5, 1, 1], // Ice Attack
    [2, 1, 1, 1, 1, 2, 1, 0.5, 1, 0.5, 0.5, 0.5, 2, 0, 1, 2, 0.5, 2], // Fighting Attack
    [1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 0, 2, 1], // Poison Attack
    [1, 2, 1, 2, 0.5, 1, 1, 2, 1, 0, 1, 0.5, 2, 1, 1, 2, 1, 1], // Ground Attack
    [1, 1, 1, 0.5, 2, 1, 2, 1, 1, 1, 1, 2, 0.5, 1, 1, 0.5, 1, 1], // Flying Attack
    [1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 0], // Psychic Attack
    [1, 0.5, 1, 1, 2, 1, 0.5, 0.5, 1, 0.5, 2, 1, 1, 0.5, 1, 0.5, 0.5, 2], // Bug Attack
    [1, 2, 1, 1, 1, 2, 0.5, 1, 0.5, 2, 1, 2, 1, 1, 1, 0.5, 1, 1], // Rock Attack
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 0.5], // Ghost Attack
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0.5, 0, 1], // Dragon Attack
    [1, 0.5, 0.5, 0.5, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 2, 1], // Steel Attack
    [1, 0.5, 1, 1, 1, 1, 2, 0.5, 1, 1, 1, 1, 1, 1, 2, 0.5, 1, 2], // Fairy Attack
    [1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 2, 1, 1, 2, 1, 1, 0.5, 0.5] // Dark Attack
];

export function TeamAnalysis({ team, isOpen, onClose }) {
    if (!isOpen) return null;

    // 1. Calculate Type Distribution & Sort
    const typeCounts = {};
    TYPES.forEach(t => typeCounts[t] = 0);

    Object.values(team).forEach(member => {
        if (member.type1 && member.type1 !== "null") typeCounts[member.type1]++;
        if (member.type2 && member.type2 !== "null") typeCounts[member.type2]++;
    });

    const sortedTypes = Object.entries(typeCounts)
        .filter(([_, count]) => count > 0)
        .sort((a, b) => b[1] - a[1]);

    // 2. Calculate Defensive Coverage against each Attacking Type
    const defensiveAnalysis = TYPES.map((attackerType, attackerIndex) => {
        let weak4 = []; // x4 Weakness
        let weak2 = []; // x2 Weakness
        let immune = []; // x0 Immunity
        let resist2 = []; // x0.5 Resistance
        let resist4 = []; // x0.25 Resistance
        let neutral = []; // x1 Neutral
        let totalScore = 0;

        Object.values(team).forEach(member => {
            // Find indices for defender types
            const defIndex1 = TYPES.indexOf(member.type1);
            const defIndex2 = member.type2 !== "null" ? TYPES.indexOf(member.type2) : -1;

            let effectiveness = 1;

            if (defIndex1 !== -1) {
                effectiveness *= TYPE_CHART[attackerIndex][defIndex1];
            }
            if (defIndex2 !== -1) {
                effectiveness *= TYPE_CHART[attackerIndex][defIndex2];
            }

            if (effectiveness === 0) { immune.push(member.name); totalScore += 0; }
            else if (effectiveness === 0.25) { resist4.push(member.name); totalScore += 0.25; }
            else if (effectiveness === 0.5) { resist2.push(member.name); totalScore += 0.5; }
            else if (effectiveness === 1) { neutral.push(member.name); totalScore += 1; }
            else if (effectiveness === 2) { weak2.push(member.name); totalScore += 2; }
            else if (effectiveness === 4) { weak4.push(member.name); totalScore += 4; }
        });

        return {
            type: attackerType,
            weak4, weak2, immune, resist2, resist4, neutral, totalScore
        };
    });

    // Helper to get top N with ties
    const getTopWithTies = (list, compareFn, n = 3) => {
        const sorted = [...list].sort(compareFn);
        if (sorted.length <= n) return sorted;

        const thresholdValue = sorted[n - 1].totalScore;
        // Include all items that have the same score as the Nth item
        return sorted.filter(item =>
            compareFn(item, sorted[n - 1]) <= 0 || item.totalScore === thresholdValue
        );
    };

    const weakestTypes = getTopWithTies(defensiveAnalysis, (a, b) => b.totalScore - a.totalScore, 3);
    const strongestTypes = getTopWithTies(defensiveAnalysis, (a, b) => a.totalScore - b.totalScore, 3);

    const renderCell = (list, color, bold = false) => {
        if (list.length === 0) return <td style={{ padding: '8px', color: '#555' }}>-</td>;
        return (
            <td
                title={list.join(", ")}
                style={{
                    padding: '8px',
                    color: color,
                    fontWeight: bold ? 'bold' : 'normal',
                    cursor: 'help'
                }}
            >
                {list.length}
            </td>
        );
    };

    const renderAnalysisCard = (title, items, isWeakness) => {
        let currentRank = 0;
        let lastScore = -1;

        return (
            <div style={{ flex: 1, minWidth: '300px', background: '#333', padding: '15px', borderRadius: '10px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: isWeakness ? '#ff6666' : '#66ff66', textAlign: 'center' }}>
                    {title}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {items.map((item, index) => {
                        // Handle Ranking with Ties
                        if (item.totalScore !== lastScore) {
                            currentRank++;
                            lastScore = item.totalScore;
                        }

                        let rankIcon = `#${currentRank}`;
                        let rankColor = '#white';

                        if (currentRank === 1) { rankIcon = "🥇"; rankColor = "#FFD700"; }
                        else if (currentRank === 2) { rankIcon = "🥈"; rankColor = "#C0C0C0"; }
                        else if (currentRank === 3) { rankIcon = "🥉"; rankColor = "#CD7F32"; }

                        return (
                            <div key={item.type} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: '5px' }}>
                                <span style={{ marginRight: '10px', fontSize: '1.2rem', minWidth: '30px', textAlign: 'center', color: rankColor, fontWeight: 'bold' }}>
                                    {rankIcon}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: typeColors[item.type] }}></div>
                                    {item.type}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: '#222',
                color: 'white',
                width: '100%',
                maxWidth: '800px',
                maxHeight: '90vh',
                overflowY: 'auto',
                borderRadius: '15px',
                border: '2px solid #faca04',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, color: '#faca04' }}>Team Analysis</h2>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
                    >✕</button>
                </div>

                <div style={{ padding: '20px' }}>

                    {/* Type Distribution Section */}
                    <h3 style={{ borderBottom: '1px solid #555', paddingBottom: '10px' }}>Type Distribution</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                        {sortedTypes.map(([type, count]) => (
                            <div key={type} style={{
                                background: typeColors[type],
                                color: 'white',
                                padding: '5px 15px',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 'bold',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                            }}>
                                <span>{type}</span>
                                <span style={{
                                    background: 'rgba(255,255,255,0.3)',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '0.9rem'
                                }}>{count}</span>
                            </div>
                        ))}
                    </div>

                    {/* Top 3 Weak/Strong Section */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
                        {renderAnalysisCard("Top Weaknesses (Takes most dmg)", weakestTypes, true)}
                        {renderAnalysisCard("Top Resistances (Takes least dmg)", strongestTypes, false)}
                    </div>

                    {/* Weakness Analysis Section */}
                    <h3 style={{ borderBottom: '1px solid #555', paddingBottom: '10px' }}>Defensive Coverage (Incoming Damage)</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #444', textAlign: 'left' }}>
                                <th style={{ padding: '8px' }}>Vs Type</th>
                                <th style={{ padding: '8px', color: '#ff4444' }}>Weak (x4)</th>
                                <th style={{ padding: '8px', color: '#ff8888' }}>Weak (x2)</th>
                                <th style={{ padding: '8px', color: '#888' }}>Neutral</th>
                                <th style={{ padding: '8px', color: '#88ff88' }}>Resist (x2)</th>
                                <th style={{ padding: '8px', color: '#44ff44' }}>Resist (x4)</th>
                                <th style={{ padding: '8px', color: '#aaaaff' }}>Immune</th>
                            </tr>
                        </thead>
                        <tbody>
                            {defensiveAnalysis.map((stat) => (
                                <tr key={stat.type} style={{ borderBottom: '1px solid #333' }}>
                                    <td style={{ padding: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: typeColors[stat.type] }}></div>
                                        {stat.type}
                                    </td>
                                    {renderCell(stat.weak4, '#ff4444', true)}
                                    {renderCell(stat.weak2, '#ff8888')}
                                    {renderCell(stat.neutral, '#888')}
                                    {renderCell(stat.resist2, '#88ff88')}
                                    {renderCell(stat.resist4, '#44ff44')}
                                    {renderCell(stat.immune, '#aaaaff', true)}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    );
}
