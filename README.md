# MLB Stats Tracker

Track your favorite MLB players' stats across a season. Log games manually, view running totals on player cards, and see who's leading the pack on the leaderboard.

## Features

- Add hitters and pitchers — the app automatically shows the right stat set based on position
- Log individual game stats per player
- Player cards display season totals with ERA averaged across logged games for pitchers
- Leaderboard with separate hitter and pitcher views, sortable by any stat
- All data persists via localStorage — nothing disappears on refresh
- Delete players you no longer want to track

## Tech

Vanilla JavaScript, HTML, CSS. No frameworks, no libraries.

## How to Use

1. Enter a player's name, team, and position and click Add Player
2. Click Log Game on any card to enter that game's stats
3. Switch to the Leaderboard tab to see sorted rankings
4. Toggle between Hitters and Pitchers on the leaderboard and sort by any stat

## Position Input

The app detects pitchers automatically. Use: `SP`, `RP`, `CP`, or `P` for pitchers. Anything else is treated as a hitter.
